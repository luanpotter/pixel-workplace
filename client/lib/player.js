import { SRC_TILE_SIZE, DEST_TILE_SIZE } from './constants.js';
import { Bubbles } from './bubbles.js';

const WALK_TIME = 400;
const BUBBLE_TIME = 3000;
const BUBBLE_FADE = 1500;

export class Player {
	constructor(scene, username, x, y, playerSkin) {
		this.scene = scene;
		this.username = username;
		this.p = { x, y };
		this.dest = null;
		this.walkClock = 0.0;
		this.bubbleClock = 0.0;
		this.frameOffset = 3 * playerSkin;

		this.sprite = this.scene.add.sprite(this.realX, this.realY, 'avatars');
		this.sprite.displayWidth = DEST_TILE_SIZE;
		this.sprite.displayHeight = DEST_TILE_SIZE;
		this.sprite.setFrame(this.frameOffset);

		this.speak(`Welcome to Pixel, ${this.username}!`);
	}

	get realX() {
		return this.realCoord('x');
	}

	get realY() {
		return this.realCoord('y');
	}

	get moveFrac() {
		return this.walkClock / WALK_TIME;
	}

	get bubbleFrac() {
		if (this.bubbleClock > BUBBLE_FADE) {
			return 0;
		}
		return 1 - this.bubbleClock / BUBBLE_FADE;
	}

	speak(message) {
		if (this.bubble != null) {
			this.bubble.destroy();
		}
		this.bubbleClock = BUBBLE_TIME;
		this.bubble = Bubbles.render(this.scene, message);
		this.moveBubble();
	}

	realCoord(prop) {
		return this.p[prop] * DEST_TILE_SIZE + this.offset(prop) + DEST_TILE_SIZE / 2;
	}

	static easeFn(x) {
		// parabola: y = -2(x^2 - x)
		return -2 * x * (x - 1);
	}

	offset(prop) {
		if (this.dest == null) {
			return 0.0;
		}
		const sign = Math.sign(this.dest[prop] - this.p[prop]);
		return sign * this.moveFrac * DEST_TILE_SIZE;
	}

	update(dt) {
		if (this.dest != null) {
			this.walkClock += dt;
			this.updateDirection();
			if (this.walkClock >= WALK_TIME) {
				this.p.x = this.dest.x;
				this.p.y = this.dest.y;
				this.dest = null;
				this.walkClock = 0.0;
			}
		}
		if (this.bubbleClock > 0) {
			this.bubbleClock -= dt;
			if (this.bubbleClock <= 0) {
				this.bubbleClock = 0;
				this.bubble.destroy();
				this.bubble = null;
			}
		}

		this.scaleEffect();
		this.sprite.x = this.realX;
		this.sprite.y = this.realY;
		this.moveBubble();
	}

	scaleEffect() {
		if (this.dest === null || this.moveFrac === 0) {
			// scale effect only if moving on y axis
			this.scaleBy(1.0);
		} else {
			this.scaleBy(1 - 0.2 * Player.easeFn(this.moveFrac));
		}
	}

	moveBubble() {
		if (this.bubble == null) {
			return;
		}
		this.bubble.x = this.sprite.x + DEST_TILE_SIZE / 2 - this.bubble.width - 4;
		this.bubble.y = this.sprite.y - DEST_TILE_SIZE / 2 - this.bubble.height - 4;

		// log decay
		// y = 1 + ln(-x*(1-1/e) + 1)
		const a = 1 - 1 / Math.E;
		this.bubble.alpha = 1 + Math.log(-a * this.bubbleFrac + 1);
	}

	scaleBy(scale) {
		this.sprite.setCrop(0, 0, SRC_TILE_SIZE, Math.round(scale * SRC_TILE_SIZE));
	}

	updateDirection() {
		if (this.dest == null) {
			return;
		}
		if (this.dest.x > this.p.x) {
			this.sprite.setFrame(this.frameOffset + 1);
			this.sprite.flipX = true;
		} else if (this.dest.x < this.p.x) {
			this.sprite.setFrame(this.frameOffset + 1);
			this.sprite.flipX = false;
		} else if (this.dest.y > this.p.y) {
			this.sprite.setFrame(this.frameOffset + 0);
			this.sprite.flipX = false;
		} else if (this.dest.y < this.p.y) {
			this.sprite.setFrame(this.frameOffset + 2);
			this.sprite.flipX = false;
		}
	}

	move({ x, y }) {
		if (this.walkClock === 0.0 && (x !== 0 || y !== 0)) {
			this.dest = { x: this.p.x + x, y: this.p.y + y };
		}
	}

	destroy() {
		this.bubble.destroy();
		super.destroy();
	}
}

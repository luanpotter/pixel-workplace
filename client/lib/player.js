import { TILE_SIZE } from './constants.js';

const WALK_TIME = 375;

export class Player {
	constructor(scene, x, y, playerSkin = 0) {
		this.scene = scene;
		this.p = { x, y };
		this.dest = null;
		this.walkClock = 0.0;
		this.frameOffset = 3 * playerSkin;

		this.sprite = this.scene.add.sprite(this.realX, this.realY, 'avatars');
		this.sprite.setFrame(this.frameOffset);
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

	realCoord(prop) {
		const realValue = this.p[prop] * TILE_SIZE + this.offset(prop) + TILE_SIZE / 2;
		return Math.round(realValue); // prevents artifacts on tilemap
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
		return sign * this.moveFrac * TILE_SIZE;
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

		this.scaleEffect();
		this.sprite.x = this.realX;
		this.sprite.y = this.realY;
	}

	scaleEffect() {
		if (this.dest === null || this.moveFrac === 0) {
			// scale effect only if moving on y axis
			this.scaleBy(1.0);
		} else {
			this.scaleBy(1 - 0.1 * Player.easeFn(this.moveFrac));
		}
	}

	scaleBy(scale) {
		this.sprite.setCrop(0, 0, TILE_SIZE, scale * TILE_SIZE);
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
}

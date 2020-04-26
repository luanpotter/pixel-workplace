import { TILE_SIZE } from './constants.js';

const WALK_TIME = 350;

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

	realCoord(prop) {
		const realValue = this.p[prop] * TILE_SIZE + this.offset(prop) + TILE_SIZE / 2;
		return Math.round(realValue); // prevents artifacts on tilemap
	}

	offset(prop) {
		if (this.dest == null) {
			return 0.0;
		}
		const sign = Math.sign(this.dest[prop] - this.p[prop]);
		return sign * (this.walkClock / WALK_TIME) * TILE_SIZE;
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

		this.sprite.x = this.realX;
		this.sprite.y = this.realY;
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

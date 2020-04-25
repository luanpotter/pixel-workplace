import { TILE_SIZE } from './constants.js';

const WALK_TIME = 350;

export class Player {
	constructor(scene, x, y) {
		this.scene = scene;
		this.p = { x, y };
		this.dest = null;
		this.walkClock = 0.0;
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

	create() {
		this.rect = this.scene.add.rectangle(this.realX, this.realY, TILE_SIZE, TILE_SIZE, 0xFF0000);
	}

	update(dt) {
		if (this.dest != null) {
			this.walkClock += dt;
			if (this.walkClock >= WALK_TIME) {
				this.p.x = this.dest.x;
				this.p.y = this.dest.y;
				this.dest = null;
				this.walkClock = 0.0;
			}
		}

		this.rect.x = this.realX;
		this.rect.y = this.realY;
	}

	move({ x, y }) {
		if (this.walkClock === 0.0 && (x !== 0 || y !== 0)) {
			this.dest = { x: this.p.x + x, y: this.p.y + y };
		}
	}
}

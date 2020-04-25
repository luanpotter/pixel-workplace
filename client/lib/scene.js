import Phaser from 'phaser';

import { TILE_SIZE } from './constants.js';

import Tileset from '../assets/images/tileset.png';
import HallRoom from '../assets/rooms/hall.json';
import { Player } from './player.js';

export class Scene extends Phaser.Scene {
	constructor() {
		super({ key: 'MainScene' });
	}

	preload() {
		this.load.image('tileset', Tileset);
		this.load.tilemapTiledJSON('hall-map', HallRoom);

		this.player = new Player(this, 7, 8);
	}

	create() {
		const map = this.make.tilemap({ key: 'hall-map', tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });
		const tiles = map.addTilesetImage('test', 'tileset');
		map.createStaticLayer('background', tiles, 0, 0);

		this.player.create();
		this.cameras.main.startFollow(this.player.rect, true);

		this.keys = this.input.keyboard.addKeys('W,A,S,D');
	}

	update(_, dt) {
		const ds = { x: this.deltaX(), y: this.deltaY() };
		this.player.move(ds);

		this.player.update(dt);
	}

	deltaX() {
		return this.deltaS({ A: -1, D: 1 });
	}

	deltaY() {
		return this.deltaS({ W: -1, S: 1 });
	}

	deltaS(keys) {
		const key = Object.entries(keys).find(e => this.keys[e[0]].isDown);
		return key ? key[1] : 0;
	}
}

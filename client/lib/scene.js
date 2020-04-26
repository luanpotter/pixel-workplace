import Phaser from 'phaser';

import { TILE_SIZE } from './constants.js';

import Tileset from '../assets/images/tileset.png';
import Avatars from '../assets/images/avatars.png';
import HallRoom from '../assets/rooms/hall.json';

import { Player } from './player.js';
import { GameStateManager } from './server/client.js';

export const SceneFactory = room => class Scene extends Phaser.Scene {
	constructor() {
		super({ key: 'MainScene' });
	}

	preload() {
		this.load.image('tileset', Tileset);
		this.load.tilemapTiledJSON('hall-map', HallRoom);

		this.load.spritesheet('avatars', Avatars, { frameWidth: 16, frameHeight: 16 });
	}

	create() {
		const map = this.make.tilemap({
			key: 'hall-map',
			tileWidth: TILE_SIZE,
			tileHeight: TILE_SIZE,
		});
		const tiles = map.addTilesetImage('test', 'tileset');
		map.createStaticLayer('background', tiles, 0, 0);

		this.player = new Player(this, 7, 8);
		this.cameras.main.startFollow(this.player.sprite, true);

		this.keys = this.input.keyboard.addKeys('W,A,S,D');

		this.gameStateManager = new GameStateManager(room, this);
	}

	update(_, dt) {
		const ds = {
			x: this.deltaX(),
			y: this.deltaY(),
		};
		this.player.move(ds);

		this.player.update(dt);
		if (this.externalPlayers) {
			this.externalPlayers.update(dt);
			this.gameStateManager.updateMe({ x: this.player.p.x, y: this.player.p.y });
		}
	}

	deltaX() {
		return this.deltaS({
			A: -1,
			D: 1,
		});
	}

	deltaY() {
		return this.deltaS({
			W: -1,
			S: 1,
		});
	}

	deltaS(keys) {
		const key = Object.entries(keys)
			.find(e => this.keys[e[0]].isDown);
		return key ? key[1] : 0;
	}
};

import Phaser from 'phaser';

import { TILE_SIZE } from './constants.js';

import Tileset from '../assets/resources/tileset/tileset.png';
import Avatars from '../assets/resources/avatars/avatars.png';
import HallRoom from '../assets/resources/rooms/hall.json';

import { Player } from './player.js';
import { GameStateManager } from './server/client.js';
import { Bubbles } from './bubbles.js';

export const SceneFactory = room => class Scene extends Phaser.Scene {
	constructor() {
		super({ key: 'MainScene' });
	}

	preload() {
		Bubbles.preload(this);

		this.load.image('tileset', Tileset);
		this.load.tilemapTiledJSON('hall-map', HallRoom);

		this.load.spritesheet('avatars', Avatars, { frameWidth: 16, frameHeight: 16 });
	}

	create() {
		this.messageDiv = document.querySelector('#write-message');
		this.messageInput = this.messageDiv.querySelector('input');
		this.isTyping = false;

		const map = this.make.tilemap({
			key: 'hall-map',
			tileWidth: TILE_SIZE,
			tileHeight: TILE_SIZE,
		});
		const tiles = map.addTilesetImage('test', 'tileset');
		map.createStaticLayer('background', tiles, 0, 0);

		this.player = new Player(this, 7, 8);
		this.cameras.main.startFollow(this.player.sprite, true);

		this.keys = this.input.keyboard.addKeys('W,A,S,D', false);

		this.input.keyboard.on('keydown_T', e => {
			if (this.isTyping) {
				return;
			}
			this.setTyping(true);
			this.messageInput.focus();
			this.messageInput.value = '';
			e.stopPropagation();
			e.preventDefault();
		});
		this.input.keyboard.on('keydown_ESC', () => {
			this.setTyping(false);
		});
		this.input.keyboard.on('keydown_ENTER', () => {
			this.setTyping(false);
			const message = this.messageInput.value;
			this.messageInput.value = '';
			this.gameStateManager.sendMessage(message);
		});

		this.gameStateManager = new GameStateManager(room, this);
	}

	setTyping(value) {
		this.isTyping = value;
		this.messageDiv.style.display = value ? 'block' : 'none';
	}

	update(_, dt) {
		if (!this.isTyping) {
			const ds = {
				x: this.deltaX(),
				y: this.deltaY(),
			};
			this.player.move(ds);
		}

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

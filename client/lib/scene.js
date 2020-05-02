import Phaser from 'phaser';

import { SRC_TILE_SIZE, DEST_TILE_SIZE } from './constants.js';

import Tileset from '../assets/resources/tileset/tileset-extruded.png';
import Avatars from '../assets/resources/avatars/avatars.png';
import HallRoom from '../assets/resources/rooms/hall.json';

import { Player } from './player.js';
import { GameStateManager } from './server/client.js';
import { Bubbles } from './bubbles.js';

export const SceneFactory = (room, username) => class Scene extends Phaser.Scene {
	constructor() {
		super({ key: 'MainScene' });
	}

	preload() {
		Bubbles.preload(this);

		this.load.image('tileset', Tileset);
		this.load.tilemapTiledJSON('hall-map', HallRoom);
		this.load.json('hall-map-json', HallRoom);

		this.load.spritesheet('avatars', Avatars, { frameWidth: SRC_TILE_SIZE, frameHeight: SRC_TILE_SIZE });
	}

	create() {
		this.messageDiv = document.querySelector('#write-message');
		this.messageInput = this.messageDiv.querySelector('input');
		this.isTyping = false;

		const map = this.make.tilemap({
			key: 'hall-map',
			tileWidth: DEST_TILE_SIZE,
			tileHeight: DEST_TILE_SIZE,
		});
		const tiles = map.addTilesetImage('test', 'tileset', SRC_TILE_SIZE, SRC_TILE_SIZE, 1, 2);
		const tileScale = DEST_TILE_SIZE / SRC_TILE_SIZE;
		map.createStaticLayer('background', tiles, 0, 0).setScale(tileScale, tileScale);

		const objects = this.parseObjectsFromTiled();
		this.walkAreas = objects.filter(e => e.type === 'WALK_AREA');

		// TODO grab this from the map json
		this.spawnPoint = {
			x: Math.round(this.walkAreas[0].x / DEST_TILE_SIZE),
			y: Math.round(this.walkAreas[0].y / DEST_TILE_SIZE),
		};
		// TODO determine skin
		const playerSkin = 0;

		this.player = new Player(this, username, this.spawnPoint.x, this.spawnPoint.y, playerSkin);
		this.cameras.main.startFollow(this.player.sprite, true);
		this.cameras.main.roundPixels = true;

		this.keys = this.input.keyboard.addKeys('W,A,S,D', false);
		this.shiftKey = this.input.keyboard.addKey('shift');

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
			if (!message || !message.trim()) {
				return;
			}
			this.gameStateManager.sendMessage(message);
		});

		this.gameStateManager = new GameStateManager(room, username, this);
	}

	parseObjectsFromTiled() {
		const mapJSON = this.cache.json.get('hall-map-json');
		const backgroundLayer = mapJSON.layers.find(e => e.name === 'background');
		const scaleFactor = DEST_TILE_SIZE / SRC_TILE_SIZE;
		return mapJSON.layers.find(e => e.name === 'objects').objects.map(e => ({
			...e,
			x: (e.x - backgroundLayer.startx * SRC_TILE_SIZE) * scaleFactor,
			y: (e.y - backgroundLayer.starty * SRC_TILE_SIZE) * scaleFactor,
			width: e.width * scaleFactor,
			height: e.height * scaleFactor,
		}));
	}

	setTyping(value) {
		this.isTyping = value;
		this.messageDiv.style.display = value ? 'block' : 'none';
	}

	update(_, dt) {
		this.handleMove();

		this.player.update(dt);
		if (this.externalPlayers) {
			this.externalPlayers.update(dt);
			this.gameStateManager.updateMe({
				x: this.player.p.x,
				y: this.player.p.y,
				direction: this.player.direction,
			});
		}
	}

	handleMove() {
		if (this.isTyping) {
			return;
		}
		const ds = {
			x: this.deltaX(),
			y: this.deltaY(),
		};
		if (ds.x === 0 && ds.y === 0) {
			return;
		}
		if (this.shiftKey.isDown) {
			this.player.move(ds, true);
			return;
		}
		if (!this.isValidDestination(this.player.p.x + ds.x, this.player.p.y + ds.y)) {
			this.player.move(ds, true);
			return;
		}
		this.player.move(ds);
	}

	isValidDestination(x, y) {
		const realX = x * DEST_TILE_SIZE;
		const realY = y * DEST_TILE_SIZE;
		return this.walkAreas.some(e => {
			if (realX < e.x || realX + DEST_TILE_SIZE > e.x + e.width) {
				return false;
			}
			if (realY < e.y || realY + DEST_TILE_SIZE > e.y + e.height) {
				return false;
			}
			return true;
		});
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
		const key = Object.entries(keys).find(e => this.keys[e[0]].isDown);
		return key ? key[1] : 0;
	}
};

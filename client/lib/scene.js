import Phaser from 'phaser';

import Tileset from '../assets/images/tileset.png';
import HallRoom from '../assets/rooms/hall.json';

export class Scene extends Phaser.Scene {
	constructor() {
		super({ key: 'MainScene' });
	}

	preload() {
		this.load.image('tileset', Tileset);
		this.load.tilemapTiledJSON('hall-map', HallRoom);
	}

	create() {
		const map = this.make.tilemap({ key: 'hall-map', tileWidth: 16, tileHeight: 16 });
		const tiles = map.addTilesetImage('test', 'tileset');
		map.createStaticLayer('background', tiles, 0, 0);
	}
}

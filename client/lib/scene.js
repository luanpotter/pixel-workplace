import Phaser from 'phaser';

import Tileset from '../assets/images/tileset.png';

export class Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('tileset', Tileset);
    }

    create() {
        const level = [
            [0, 1, 1, 1, 1, 1, 2],
            [9, -1, -1, -1, -1, -1, 11],
            [9, -1, -1, -1, -1, -1, 11],
            [9, -1, -1, -1, -1, -1, 11],
            [9, -1, -1, -1, -1, -1, 11],
            [9, -1, -1, -1, -1, -1, 11],
            [18, 19, 19, 19, 19, 19, 20],
        ];
        const map = this.make.tilemap({ data: level, tileWidth: 12, tileHeight: 12 });
        const tiles = map.addTilesetImage('tileset');
        map.createStaticLayer(0, tiles, 0, 0);
    }
}
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
        this.tileset = this.add.image(100, 500, 'tileset');
        this.add.rectangle(10, 10, 100, 100, 0xFF0000);
    }
}
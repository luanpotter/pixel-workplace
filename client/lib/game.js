import Phaser from 'phaser';

import { Scene } from './scene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [ Scene ],
};

new Phaser.Game(config);
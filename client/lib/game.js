import Phaser from 'phaser';

import { Scene } from './scene.js';

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [Scene],
	pixelArt: true,
	roundPixels: true,
	antialias: false,
	zoom: 2,
};

// eslint-disable-next-line no-new
new Phaser.Game(config);

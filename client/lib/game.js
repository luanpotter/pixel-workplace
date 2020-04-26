import Phaser from 'phaser';

import { SceneFactory } from './scene.js';
import { connectRoom } from './server/client.js';


const bootStrapGame = () => {
	connectRoom().then(room => {
		const Scene = SceneFactory(room);

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
	});
};


bootStrapGame();

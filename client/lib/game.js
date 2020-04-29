import Phaser from 'phaser';
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice';

import { SceneFactory } from './scene.js';
import { connectRoom } from './server/client.js';


// eslint-disable-next-line no-unused-vars
const bootStrapGame = () => {
	return connectRoom().then(room => {
		const Scene = SceneFactory(room);

		const config = {
			type: Phaser.AUTO,
			width: 800,
			height: 600,
			pixelArt: true,
			roundPixels: true,
			antialias: false,
			zoom: 2,
			parent: 'game',
			scene: [Scene],
			plugins: {
				global: [NineSlicePlugin.DefaultCfg],
			},
		};

		return new Phaser.Game(config);
	});
};

const login = () => {
	const usernameInput = document.querySelector('#username-input');
	if (!usernameInput.value) return;

	const username = usernameInput.value.toLowerCase();
	// eslint-disable-next-line no-console
	console.log(username);
};

document.addEventListener('DOMContentLoaded', () => {
	const logginButton = document.querySelector('#login-button');
	logginButton.onclick = login;
});

// bootStrapGame();

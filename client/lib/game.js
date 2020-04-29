import Phaser from 'phaser';
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice';

import { SceneFactory } from './scene.js';
import { connectRoom } from './server/client.js';

const boostrapGame = (room, username) => {
	const Scene = SceneFactory(room, username);

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
};

document.addEventListener('DOMContentLoaded', () => {
	connectRoom().then(room => {
		room.onMessage(`success-login-${room.sessionId}`, ({ success, username }) => {
			if (!success) {
				const errorMessage = document.querySelector('#error-message');
				errorMessage.style.display = 'block';
				return;
			}

			const loginSection = document.querySelector('#login');
			loginSection.style.display = 'none';
			boostrapGame(room, username);
		});

		const formLogin = document.querySelector('#form-login');

		formLogin.onsubmit = e => {
			e.preventDefault();
			const usernameInput = document.querySelector('#username-input');
			if (!usernameInput.value) return;

			const username = usernameInput.value.toLowerCase();
			room.send('check-username', username);
		};
	});
});

import Phaser from 'phaser';
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice';

import { SceneFactory } from './scene.js';
import { connectRoom } from './server/client.js';

const boostrapGame = (room, username, skin) => {
	const Scene = SceneFactory(room, username, skin);

	const scaleFactor = 1;
	const width = (0.8 * window.innerWidth) / scaleFactor;
	const height = (0.8 * window.innerHeight) / scaleFactor;

	const config = {
		type: Phaser.AUTO,
		width,
		height,
		pixelArt: true,
		roundPixels: true,
		antialias: true,
		zoom: scaleFactor,
		parent: 'game',
		scene: [Scene],
		plugins: {
			global: [NineSlicePlugin.DefaultCfg],
		},
	};

	return new Phaser.Game(config);
};

document.addEventListener('DOMContentLoaded', () => {
	const errorMessage = document.querySelector('#error-message');
	const formLogin = document.querySelector('#form-login');
	const usernameInput = document.querySelector('#username-input');
	const skinSelector = document.querySelector('#skin-selector');

	connectRoom().then(room => {
		room.onMessage(`success-login-${room.sessionId}`, ({ success, username }) => {
			if (!success) {
				errorMessage.innerHTML = 'This username is already being used.';
				errorMessage.style.display = 'block';
				return;
			}

			const selectedSkin = parseInt(skinSelector.options[skinSelector.selectedIndex].value, 10);
			const loginSection = document.querySelector('#login');
			loginSection.style.display = 'none';
			boostrapGame(room, username, selectedSkin);
		});

		formLogin.onsubmit = e => {
			e.preventDefault();
			const username = usernameInput.value.trim().toLowerCase();
			const selectedSkin = parseInt(skinSelector.options[skinSelector.selectedIndex].value, 10);
			if (username.length === 0 || selectedSkin === -1) {
				errorMessage.innerHTML = 'Please select a username and skin.';
				errorMessage.style.display = 'block';
				return;
			}

			room.send('check-username', username);
		};

		usernameInput.focus();
	});
});

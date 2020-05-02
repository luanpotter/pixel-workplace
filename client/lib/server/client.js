import { Client } from 'colyseus.js';
import { Player } from '../player.js';
import { deepEquals } from '../utils.js';

const DEFAULT_OFFICE_NAME = 'workspace';
const server = process.env.SERVER_URL;

// eslint-disable-next-line no-console
console.info(`Will connect to server at ${server}`);

const client = new Client(server);

class ExternalPayers {
	constructor(scene) {
		this.players = new Map();
		this.scene = scene;
	}

	add(id, { username, skin, x, y, direction }) {
		const player = new Player(this.scene, username, x, y, skin);
		player.direction = direction;
		player.updateDirection();
		this.players.set(id, player);
	}


	update(dt) {
		this.players.forEach(player => {
			player.update(dt);
		});
	}

	change(id, movement) {
		const player = this.players.get(id);
		const x = movement.x - player.p.x;
		const y = movement.y - player.p.y;

		if (player.lastUpdatedAt > movement.lastUpdatedAt) {
			return;
		}
		player.lastUpdatedAt = movement.lastUpdatedAt;
		player.move({ x, y });
		player.direction = movement.direction;
		player.updateDirection();
	}

	remove(id) {
		const player = this.players.get(id);
		player.sprite.destroy();
		this.players.delete(id);
	}

	speak(id, message) {
		const player = this.players.get(id);
		player.speak(message);
	}
}


export class GameStateManager {
	constructor(room, username, skin, scene) {
		this.room = room;
		this.addScene(scene, username, skin);

		this.room.onMessage('status-messages', content => {
			// eslint-disable-next-line no-console
			console.info('Server:', content);
		});

		this.room.state.players.onAdd = this.onAddPlayer.bind(this);
		this.room.state.players.onRemove = this.onRemovePlayer.bind(this);
		this.room.state.players.onChange = this.onChangePlayer.bind(this);

		this.room.onMessage('chat-messages', ({ player, message }) => {
			if (this.isItMe(player)) {
				this.scene.player.speak(message);
			} else {
				this.scene.externalPlayers.speak(player, message);
			}
		});
	}

	addScene(scene, username, skin) {
		this.scene = scene;
		this.scene.externalPlayers = new ExternalPayers(this.scene);

		const { spawnPoint } = this.scene;
		const data = { username, skin, x: spawnPoint.x, y: spawnPoint.y, direction: 0 };
		this.room.send('create', data);

		Object.keys(this.room.state.players).forEach(id => {
			if (!this.isItMe(id)) {
				const player = this.room.state.players[id];
				this.scene.externalPlayers.add(id, player);
			}
		});
	}

	updateMe(movement) {
		if (deepEquals(this.movement, movement)) return;
		this.movement = movement;
		this.lastUpdatedAt = Date.now();
		this.room.send('move', { ...movement, lastUpdatedAt: this.lastUpdatedAt });
	}

	sendMessage(message) {
		this.room.send('send-chat', message);
	}

	isItMe(key) {
		return this.room.sessionId === key;
	}

	onAddPlayer(player, key) {
		if (!this.scene || !this.scene.externalPlayers) return;
		if (this.isItMe(key)) return;

		this.scene.externalPlayers.add(key, player);
	}

	onRemovePlayer(_, key) {
		if (!this.scene || !this.scene.externalPlayers) return;
		if (this.isItMe(key)) return;

		this.scene.externalPlayers.remove(key);
	}

	onChangePlayer(player, key) {
		if (!this.scene || !this.scene.externalPlayers) return;
		if (this.isItMe(key)) return;

		this.scene.externalPlayers.change(key, player);
	}
}

export const connectRoom = () => client.joinOrCreate(DEFAULT_OFFICE_NAME);

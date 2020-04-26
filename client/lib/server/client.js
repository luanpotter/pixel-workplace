import { Client } from 'colyseus.js';
import { Player } from '../player.js';

const PORT = 3000;
const DEFAULT_OFFICE_NAME = 'workspace';

const client = new Client(`ws://localhost:${PORT}`);

class ExternalPayers {
	constructor(scene) {
		this.players = new Map();
		this.scene = scene;
	}

	add(id, { x, y }) {
		const player = new Player(this.scene, x, y, 0xFF00FF);
		this.players.set(id, player);
		player.create();
	}


	update(dt) {
		this.players.forEach(player => player.update.bind(player)(dt));
	}

	change(id, { x, y }) {
		const player = this.players.get(id);
		const newX = x - player.p.x;
		const newY = y - player.p.y;
		player.move({ x: newX, y: newY });
		console.warn({ x: newX, y: newY });
	}

	remove(id) {
		const player = this.players.get(id);
		player.rect.destroy();
		this.players.delete(id);
	}
}


export class GameStateManager {
	constructor(room, scene) {
		this.room = room;
		this.addScene(scene);

		this.room.state.players.onAdd = this.onAddPlayer.bind(this);
		this.room.state.players.onRemove = this.onRemovePlayer.bind(this);
		this.room.state.players.onChange = this.onChangePlayer.bind(this);
	}

	addScene(scene) {
		this.scene = scene;
		this.scene.externalPlayers = new ExternalPayers(this.scene);
		const data = { x: 7, y: 8 };
		this.room.send('create', data);

		Object.keys(this.room.state.players).forEach(id => {
			if (!this.isItMe(id)) {
				const player = this.room.state.players[id];
				this.scene.externalPlayers.add(id, player);
			}
		});
	}

	updateMe(coords) {
		if (this.coords && this.coords.x === coords.x && this.coords.y === coords.y) return;
		this.coords = coords;
		this.room.send('move', coords);
	}


	isItMe(key) {
		return this.room.sessionId === key;
	}

	onAddPlayer(player, key) {
		if (!this.scene || !this.scene.externalPlayers) return;
		if (this.isItMe(key)) return;
		this.scene.externalPlayers.add(key, player);
	}

	onRemovePlayer(player, key) {
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

// eslint-disable-next-line max-len
export const connectRoom = () => client.joinOrCreate(DEFAULT_OFFICE_NAME);
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
		const playerSkin = 1; // TODO determine skin
		const player = new Player(this.scene, x, y, playerSkin);
		this.players.set(id, player);
	}


	update(dt) {
		this.players.forEach(player => {
			player.update(dt);
		});
	}

	change(id, { x: oldX, y: oldY }) {
		const player = this.players.get(id);
		const x = oldX - player.p.x;
		const y = oldY - player.p.y;

		player.move({ x, y });
	}

	remove(id) {
		const player = this.players.get(id);
		player.sprite.destroy();
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
		if (this.coords && (this.coords.x === coords.x && this.coords.y === coords.y)) return;
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

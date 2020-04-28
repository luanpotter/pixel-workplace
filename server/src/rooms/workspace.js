const { Room } = require('colyseus')
const schema = require('@colyseus/schema')
const Player = require('../entities/player')
const { Schema, MapSchema } = schema

class State extends Schema {
  constructor() {
    super()

    this.players = new MapSchema()
  }

  createPlayer(id, position) {
    this.players[id] = new Player(position.x, position.y)
  }

  removePlayer(id) {
    delete this.players[id]
  }

  movePlayer(id, movement) {
    if (movement.x) { this.players[id].x = movement.x }
    if (movement.y) { this.players[id].y = movement.y }
  }
}

schema.defineTypes(State, {
  players: { map: Player }
})

const roomName = 'WorkspaceRoom'

module.exports = class Workspace extends Room {
  onCreate() {
    console.log(`${roomName} Created`)

    this.setState(new State())

    // chat
    this.onMessage('send-chat', (client, message) => {
      console.log(`${roomName} received message from ${client.sessionId}: ${message}`)
      this.broadcast('chat-messages', { player: client.sessionId, message })
    })

    // move player
    this.onMessage('move', (client, data) => {
      console.log(`${roomName} received message move from ${client.sessionId}: ${JSON.stringify(data)}`)
      this.state.movePlayer(client.sessionId, data)
      console.log('move', this.state.players[client.sessionId].x)
    })

    // create player
    this.onMessage('create', (client, data) => {
      console.log(`${roomName} creating player ${client.sessionId}: ${JSON.stringify(data)}`)
      this.state.createPlayer(client.sessionId, data)
      console.log('create', this.state.players[client.sessionId].x)
    })
  }

  onJoin(client) {
    this.broadcast('status-messages', `${client.sessionId} joined.`)
  }

  onLeave(client) {
    this.state.removePlayer(client.sessionId)
    this.broadcast('status-messages', `${client.sessionId} left.`)
  }

  onDispose() {
    console.log(`Dispose ${roomName}`)
  }
}

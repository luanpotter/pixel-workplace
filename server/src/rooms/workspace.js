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
    if (movement.x) { this.players[id].x += movement.x }
    if (movement.y) { this.players[id].y += movement.y }
  }
}

schema.defineTypes(State, {
  players: { map: Player }
})

module.exports = class Workspace extends Room {
  onCreate() {
    console.log('WorkspaceRoom Created')

    this.setState(new State())

    // #Chat example
    // Listen to the event
    this.onMessage('chatRequest', (client, message) => {
      console.log(`WorkspaceRoom received message from ${client.sessionId}: ${message}`)
      // Returns content for broadcast
      this.broadcast('chatResponse', `(${client.sessionId}) ${message}`)
    })

    // #Move Person
    this.onMessage('move', (client, data) => {
      console.log(`WorkspaceRoom received message move from ${client.sessionId}: ${JSON.stringify(data)}`)
      this.state.movePlayer(client.sessionId, data)
      console.log('move', this.state.players[client.sessionId].x)
    })

    // #Create player
    this.onMessage('create', (client, data) => {
      console.log(`WorkspaceRoom creating player ${client.sessionId}: ${JSON.stringify(data)}`)
      this.state.createPlayer(client.sessionId, data)
      console.log('create', this.state.players[client.sessionId].x)
    })
  }

  onJoin(client) {
    this.broadcast('messages', `${client.sessionId} joined.`)
  }

  onLeave(client) {
    this.state.removePlayer(client.sessionId)
    this.broadcast('messages', `${client.sessionId} left.`)
  }

  onDispose() {
    console.log('Dispose WorkspaceRoom')
  }
}

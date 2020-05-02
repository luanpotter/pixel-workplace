const schema = require('@colyseus/schema')
const { Schema } = schema

class Player extends Schema {
  constructor(username, x, y, direction, lastUpdatedAt) {
    super(username, x, y, direction, lastUpdatedAt)
    this.username = username
    this.x = x
    this.y = y
    this.direction = direction
    this.lastUpdatedAt = lastUpdatedAt
  }
}

schema.defineTypes(Player, {
  username: 'string',
  x: 'number',
  y: 'number',
  direction: 'number',
  lastUpdatedAt: 'number'
})

module.exports = Player

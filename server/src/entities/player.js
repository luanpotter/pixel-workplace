const schema = require('@colyseus/schema')
const { Schema } = schema

class Player extends Schema {
  constructor(username, skin, x, y, direction, lastUpdatedAt) {
    super(username, skin, x, y, direction, lastUpdatedAt)
    this.username = username
    this.skin = skin
    this.x = x
    this.y = y
    this.direction = direction
    this.lastUpdatedAt = lastUpdatedAt
  }
}

schema.defineTypes(Player, {
  username: 'string',
  skin: 'number',
  x: 'number',
  y: 'number',
  direction: 'number',
  lastUpdatedAt: 'number'
})

module.exports = Player

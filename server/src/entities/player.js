const schema = require('@colyseus/schema')
const { Schema } = schema

class Player extends Schema {
  constructor(username, x, y) {
    super(username, x, y)
    this.username = username
    this.x = x
    this.y = y
  }
}

schema.defineTypes(Player, {
  username: 'string',
  x: 'number',
  y: 'number'
})

module.exports = Player

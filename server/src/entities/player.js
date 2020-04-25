const schema = require('@colyseus/schema')
const { Schema } = schema

class Player extends Schema {
  constructor(x, y) {
    super(x, y)
    this.x = x
    this.y = y
  }
}

schema.defineTypes(Player, {
  x: 'number',
  y: 'number'
})

module.exports = Player

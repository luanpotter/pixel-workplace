const express = require('express')
const colyseus = require('colyseus')
const { createServer } = require('http')
const Workspace = require('./rooms/workspace')

const app = express()
app.use(express.json())

const gameServer = new colyseus.Server({
  server: createServer(app)
})

gameServer.define('workspace', Workspace).enableRealtimeListing()

module.exports = gameServer

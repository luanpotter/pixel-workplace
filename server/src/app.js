const express = require('express')
const colyseus = require('colyseus')
const { createServer } = require('http')
const Workspace = require('./rooms/workspace')

const app = express()
app.use(express.json())

app.get('/hello', (req, res) => res.send('Welcome to Pixel Workspace!'))

app.use(express.static('public'))

const gameServer = new colyseus.Server({
  server: createServer(app)
})

gameServer.define('workspace', Workspace).enableRealtimeListing()

module.exports = gameServer

const express = require('express')
const forceSSL = require('express-force-ssl')
const colyseus = require('colyseus')
const { createServer } = require('http')
const Workspace = require('./rooms/workspace')

const VERSION = process.env.HEROKU_SLUG_COMMIT || 'dev'

const app = express()
app.use(express.json())
app.use(forceSSL)

app.get('/hello', (req, res) => res.send(`Welcome to Pixel Workspace! Version: ${VERSION}`))

app.use(express.static('../client/dist'))

const gameServer = new colyseus.Server({
  server: createServer(app)
})

gameServer.define('workspace', Workspace).enableRealtimeListing()

module.exports = gameServer

const express = require('express')
const colyseus = require('colyseus')
const { createServer } = require('http')
const Workspace = require('./rooms/workspace')

const ENV = process.env.NODE_ENV || 'development'
const VERSION = process.env.HEROKU_SLUG_COMMIT || 'dev'

const forceSSL = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''))
  }
  return next()
}

const app = express()
app.use(express.json())
if (ENV !== 'development') {
  app.use(forceSSL)
}

app.get('/hello', (req, res) => res.send(`Welcome to Pixel Workspace! Version: ${VERSION}`))

app.use(express.static('../client/dist'))

const gameServer = new colyseus.Server({
  server: createServer(app)
})

gameServer.define('workspace', Workspace).enableRealtimeListing()

module.exports = gameServer

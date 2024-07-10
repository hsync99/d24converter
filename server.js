'use strict'

const config = require('./config')
const Hapi = require('@hapi/hapi')

const server = new Hapi.Server({
  port: parseInt(config.SERVER_PORT, 10),
  routes: {
    cors: {
      credentials: true
    }
  }
})

server.route(require('./routes'))

module.exports.start = () =>
  server.register([require('@hapi/inert')])
    .then(() => server.start())
    .then(() => console.log('Server running at:', server.info.uri))

module.exports.stop = () =>
  server.stop().then(() => console.log('Server stopped'))

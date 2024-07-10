'use strict'

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  PAYLOAD_MAX_SIZE: process.env.PAYLOAD_MAX_SIZE || 1048576,
  PAYLOAD_TIMEOUT: process.env.PAYLOAD_TIMEOUT || false,
  TIMEOUT_SOCKET: process.env.TIMEOUT_SOCKET || 120000
}

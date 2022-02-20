import './config'

import ws from 'ws'
import http from 'http'
import { v4 as uuid } from 'uuid'
import { Signale } from 'signale'

import { f, o, r } from '@/utils'
import { PORT } from '@/config/globals'

const server = http.createServer(f.noop)

const logger = new Signale({
  scope: 'server',
})

const socketServer = new ws.Server({
  server,
})

/**
 * @type { import('ws').WebSocket[] }
 */
const sockets = []

socketServer.on('connection', (client) => {
  // Assigns the socket a name
  // and an identifier to be
  // used later.
  client.name = r.getRandomUsername()
  client.id = uuid()

  logger.success(`Client '${client.name}' connected`)
  logger.info(`Broadcasting message to connected sockets.`)

  // Appends the socket to the
  // sockets array (application)
  // context.
  sockets.push(client)

  // Broadcasts to all sockets
  // that a new client has
  // connected.
  sockets.forEach((socket) => {
    // Send a message of a connection type,
    // notifying that a new client has
    // connected.
    socket.send(
      o.toString({
        type: 'CONNECTION',
        data: {
          user: 'Server',
          message: `${client.name} connected`,
          id: uuid(),
          date: new Date().toUTCString(),
        },
      })
    )

    // Sends a message of type 'CONNECTED_CLIENTS',
    // returning all the current connected clients.
    socket.send(
      o.toString({
        type: 'CONNECTED_CLIENTS',
        data: sockets.map((socket) => ({
          name: socket.name,
          id: socket.id,
        })),
      })
    )
  })

  // Sends a registration message, this is
  // mainly to signal to the front-end what
  // the name of the sender (or current user)
  // should be.
  client.send(
    o.toString({
      type: 'REGISTRATION',
      data: {
        username: client.name,
      },
    })
  )

  client.on('message', (message) => {
    logger.info(`Client '${client.name}' sent the message: "${message}"`)

    // On the event of a message, broadcast
    // it to all clients.
    sockets.forEach(($socket) => {
      $socket.send(
        o.toString({
          type: 'MESSAGE',
          data: {
            user: client.name,
            message: message.toString(),
            id: uuid(),
            date: new Date().toUTCString(),
          },
        })
      )
    })
  })

  client.on('close', () => {
    logger.warn(`Client '${client.name}' has disconnected.`)

    // When disconnected, remove the client
    // from the sockets array.
    sockets.splice(sockets.indexOf(client), 1)

    // Broadcast the event of a disconnected
    // client to all other connected ones.
    sockets.forEach(($socket) => {
      $socket.send(
        o.toString({
          type: 'DISCONNECTION',
          data: {
            user: 'Server',
            message: `Client '${client.name}' disconnected`,
            id: uuid(),
            date: new Date().toUTCString(),
          },
        })
      )

      // Send a message for revalidation to the front-end
      // on the event of a disconnection for a client.
      $socket.send(
        o.toString({
          type: 'CONNECTED_CLIENTS',
          data: sockets.map((socket) => ({
            name: socket.name,
            id: socket.id,
          })),
        })
      )
    })
  })
})

server.listen(1337, () => logger.info(`Server started on port :${PORT} 🔥`))

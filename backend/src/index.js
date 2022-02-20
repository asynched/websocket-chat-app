const ws = require('ws')
const { v4 } = require('uuid')
const http = require('http')
const signale = require('signale')
const { Chance } = require('chance')

const $ = (data) => JSON.stringify(data)

const noop = (_req, _res) => void 0

const logger = new signale.Signale({
  scope: 'server',
})

const chance = new Chance()

const server = http.createServer(noop)

const socketServer = new ws.Server({
  server,
})

/**
 * @type { import('ws').WebSocket[] }
 */
const sockets = []

socketServer.on('connection', (socket) => {
  socket.name = chance.twitter()
  socket.id = v4()

  logger.success(`Client '${socket.name}' connected`)
  logger.info(`Broadcasting message to connected sockets.`)

  sockets.push(socket)

  sockets.forEach(($socket) => {
    $socket.send(
      $({
        type: 'CONNECTION',
        data: {
          user: 'Server',
          message: `Client '${socket.name}' connected`,
          id: v4(),
          date: new Date().toUTCString(),
        },
      })
    )

    $socket.send(
      $({
        type: 'CONNECTED_CLIENTS',
        data: sockets.map((socket) => ({
          name: socket.name,
          id: socket.id,
        })),
      })
    )
  })

  socket.send(
    $({
      type: 'REGISTRATION',
      data: {
        username: socket.name,
      },
    })
  )

  socket.on('message', (message) => {
    logger.info(`Client '${socket.name}' sent the message: "${message}"`)

    sockets.forEach(($socket) => {
      $socket.send(
        $({
          type: 'MESSAGE',
          data: {
            user: socket.name,
            message: message.toString(),
            id: v4(),
            date: new Date().toUTCString(),
          },
        })
      )
    })
  })

  socket.on('close', () => {
    logger.warn(`Client '${socket.name}' has disconnected.`)
    sockets.splice(sockets.indexOf(socket), 1)

    sockets.forEach(($socket) => {
      $socket.send(
        $({
          type: 'DISCONNECTION',
          data: {
            user: 'Server',
            message: `Client '${socket.name}' disconnected`,
            id: v4(),
            date: new Date().toUTCString(),
          },
        })
      )

      $socket.send(
        $({
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

server.listen(1337, () => logger.info('Server started on port :1337'))

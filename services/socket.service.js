import { logger } from './logger.service.js'
import { Server } from 'socket.io'

var gIo = null

export function setupSocketAPI(http) {
    let currentStation = {}
    let users = []


    gIo = new Server(http, {
        cors: {
            origin: '*',
        }
    })


    gIo.on('connection', socket => {

        logger.info(`New connected socket [id: ${socket.id}]`)

        socket.emit('currentStation', currentStation);
        users.push(socket.id)

        socket.on('stationUpdated', (newStation) => {
            currentStation = newStation

            users.forEach((userId) => {
                if (userId !== socket.id) {
                    io.to(userId).emit('stationUpdated', newStation);
                    io.to(userId).emit('notification', 'Current playlist got updated');
                }
            })

        })

        socket.on('disconnect', socket => {
            users = users.filter((userId) => userId !== socket.id)
            logger.info(`Socket disconnected [id: ${socket.id}]`)
        })

        socket.on('station-watch', stationId => {
            logger.info(`Station watch from socket [id: ${socket.id}]`)
            socket.join('watching:' +stationId)
        })

        socket.on('station-add', (station) => {
            logger.info(`Station added: ${station.name}`)
            broadcast({ type: 'station-add', data: station })
        })

        socket.on('station-remove', (stationId) => {
            logger.info(`Station removed: ${stationId}`)
            broadcast({ type: 'station-remove', data: { id: stationId } });
        })

    })
}

export function sendPlaylistUpdate(newStation) {
    if (io) {
        io.emit('playlistUpdated', newStation);
        io.emit('notification', 'Playlist got updated!');
    }
}



function emitTo({ type, data, label = null }) {
    if (label) gIo.to('watching:' + label.toString()).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for user: ${userId}`)
        // _printSockets()
    }
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
// async function broadcast({ type, data, room = null, userId }) {
//     userId = userId.toString()

//     logger.info(`Broadcasting event: ${type}`)
//     const excludedSocket = await _getUserSocket(userId)
//     if (room && excludedSocket) {
//         logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
//         excludedSocket.broadcast.to(room).emit(type, data)
//     } else if (excludedSocket) {
//         logger.info(`Broadcast to all excluding user: ${userId}`)
//         excludedSocket.broadcast.emit(type, data)
//     } else if (room) {
//         logger.info(`Emit to room: ${room}`)
//         gIo.to(room).emit(type, data)
//     } else {
//         logger.info(`Emit to all`)
//         gIo.emit(type, data)
//     }
// }

async function broadcast({ type, data, room = null }) {
    logger.info(`Broadcasting event: ${type}`);

    if (room) {
        logger.info(`Emit to room: ${room}`);
        gIo.to(room).emit(type, data);
    } else {
        logger.info(`Emit to all`);
        gIo.emit(type, data);
    }
}


async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

export const socketService = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}

import SocketIO from 'socket.io';

import connection from './connection';

export function loadSocketEvents(io: SocketIO.Server) {
    io.on('connection', connection);
}

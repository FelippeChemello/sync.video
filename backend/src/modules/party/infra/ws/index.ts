import socketio from 'socket.io';

export const connection = (socket: socketio.Socket) => {
    console.log('connection', socket.id);
    socket.emit('status', 'Hello from Socket.io');

    socket.on('disconnect', () => {
        console.log('client disconnected', socket.id);
    });
};

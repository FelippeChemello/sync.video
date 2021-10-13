import { authorize } from '@thream/socketio-jwt';
import socketio from 'socket.io';

import authConfig from '../../../config/auth';
import { server } from './http';
import { loadSocketEvents } from '../../../modules/party/infra/http/socketEvents';

const io: socketio.Server = new socketio.Server();

function startSocketIo() {
    io.attach(server, {
        cors: { origin: '*' },
    });

    io.use(authorize({ secret: authConfig.jwt.secret }));

    loadSocketEvents(io);
}

export { io, startSocketIo };

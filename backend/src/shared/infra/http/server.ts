import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { authorize } from '@thream/socketio-jwt';
import socketio from 'socket.io';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';
import { ConnectionOptions, createConnections } from 'typeorm';

import routes from './routes';
import errorHandler from './middlewares/error';
import registerRepositories from '../../container';
import { connection as ioConnection } from '../../../modules/party/infra/http/websocket';
import ormConfig from '../../../config/ormconfig';
import authConfig from '../../../config/auth';

const port: number = parseInt(process.env.PORT || '3001', 10);
const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();

(async () => {
    await createConnections(ormConfig as ConnectionOptions[]);

    console.log('🛸 Database connection created');

    registerRepositories();

    io.attach(server, { cors: { origin: '*' } });

    io.use(authorize({ secret: authConfig.jwt.secret }));

    io.on('connection', ioConnection);

    app.use(cors());
    app.use(express.json());

    app.use(routes);

    app.use(errors());

    app.use(errorHandler);

    server.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
    });
})();

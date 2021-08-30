import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import socketio from 'socket.io';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';
import { ConnectionOptions, createConnections } from 'typeorm';

import routes from './routes';
import { connection as ioConnection } from '../../../modules/party/infra/ws';
import AppError from '../../errors/AppError';
import ormConfig from '../../../config/ormconfig'

const port: number = parseInt(process.env.PORT || '3001', 10);
const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();

(async () => {
    await createConnections(ormConfig as ConnectionOptions[]);

    console.log('🛸 Database connection created');

    import('../../container');

    io.attach(server, { cors: { origin: '*' } });

    io.on('connection', ioConnection);

    app.use(cors());
    app.use(express.json());

    app.use(routes);

    app.use(errors());

    app.use(
        (err: Error, request: Request, response: Response, _: NextFunction) => {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({
                    status: 'error',
                    message: err.message,
                });
            }

            console.error(err);

            return response.status(500).json({
                status: 'error',
                message: 'Internal server error',
            });
        },
    );

    server.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
    });
})();

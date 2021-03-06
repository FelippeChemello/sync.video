import express from 'express';
import http from 'http';
import cors from 'cors';
import { errors } from 'celebrate';
import { ExpressPeerServer } from 'peer';

import apiConfig from '../../../config/api';

import routes from './routes';
import errorHandler from './middlewares/error';

const port: number = parseInt(process.env.PORT || '3001', 10);
const app: express.Express = express();
const server: http.Server = http.createServer(app);

function startServer() {
    app.use(cors());
    app.use(express.json());

    app.use(routes);

    app.use(errors());

    app.use(errorHandler);

    app.use('/peer', ExpressPeerServer(server));

    app.use('/files', express.static(apiConfig.uploadFolder));

    app.get('/', (req, res) => {
        res.send({ status: 'ok' });
    });

    server.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
    });
}

export { server, app, startServer };

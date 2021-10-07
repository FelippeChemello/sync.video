import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';

import { startServer } from './http';
import { startSocketIo } from './io';
import startDatabase from './databse';
import registerRepositories from '../../container';

(async () => {
    await startDatabase();

    registerRepositories();

    startSocketIo();

    startServer();
})();

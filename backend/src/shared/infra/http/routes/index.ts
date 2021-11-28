import { Router } from 'express';

import usersRouter from '../../../../modules/users/infra/http/routes/users';
import sessionsRouter from '../../../../modules/users/infra/http/routes/sessions';
import partyRouter from '../../../../modules/party/infra/http/routes/party';
import fileRouter from '../../../../modules/file/infra/http/routes/file'

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/party', partyRouter);
routes.use('/file', fileRouter)

export default routes;

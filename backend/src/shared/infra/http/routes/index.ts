import { Router } from 'express';

import usersRouter from '../../../../modules/users/infra/http/routes/users';
import sessionsRouter from '../../../../modules/users/infra/http/routes/sessions';
import partyRouter from '../../../../modules/party/infra/http/routes/party';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/party', partyRouter);

export default routes;

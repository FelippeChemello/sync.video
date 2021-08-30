import { Router } from 'express';

import usersRouter from '../../../../modules/users/infra/http/routes/users';
import sessionsRouter from '../../../../modules/users/infra/http/routes/sessions';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;

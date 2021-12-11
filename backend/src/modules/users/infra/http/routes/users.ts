import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '../middlewares/ensureIsAuthenticated';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(8),
            avatar: Joi.string().required(),
        },
    }),
    usersController.create,
);

usersRouter.get('/', ensureAuthenticated, usersController.get);

export default usersRouter;

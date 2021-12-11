import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    sessionsController.create,
);

sessionsRouter.post(
    '/forgot-password',
    celebrate({ [Segments.BODY]: { email: Joi.string().email().required() } }),
    sessionsController.forgotPassword,
);

sessionsRouter.post(
    '/reset-password',
    celebrate({
        [Segments.BODY]: {
            token: Joi.string().required(),
            password: Joi.string().required().min(8),
        },
    }),
    sessionsController.resetPassword,
);

export default sessionsRouter;

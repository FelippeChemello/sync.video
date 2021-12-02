import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import FileController from '../controllers/FileController';
import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureIsAuthenticated';

const partyRouter = Router();
const fileController = new FileController();

partyRouter.get(
    '/:id',
    ensureAuthenticated,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    fileController.get,
);

partyRouter.get('/', ensureAuthenticated, fileController.getAll);

partyRouter.post('/', ensureAuthenticated, fileController.create);

export default partyRouter;

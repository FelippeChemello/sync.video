import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';

import apiConfig from '../../../../../config/api'

import FileController from '../controllers/FileController';
import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureIsAuthenticated';

const partyRouter = Router();
const fileController = new FileController();

const upload = multer(apiConfig.multer)

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

partyRouter.get(
    '/',
    ensureAuthenticated,
    fileController.getAll,
);

partyRouter.post(
    '/',
    ensureAuthenticated,
    celebrate({
        [Segments.BODY]: {
            title: Joi.string().required(),
            description: Joi.string().required(),
        },
    }),
    upload.single('file'),
    fileController.create,
);

export default partyRouter;

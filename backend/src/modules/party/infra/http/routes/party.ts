import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import PartyController from '../controllers/PartyController';
import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureIsAuthenticated';

const partyRouter = Router();
const partyController = new PartyController();

partyRouter.post('/', ensureAuthenticated, partyController.create);

partyRouter.get('/videos', ensureAuthenticated, partyController.getVideos);

partyRouter.get(
    '/:id',
    ensureAuthenticated,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    partyController.get,
);

partyRouter.patch(
    '/:id/url',
    ensureAuthenticated,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            url: Joi.string().required(),
        },
    }),
    partyController.updateUrl,
);

partyRouter.post(
    '/:id/addParticipant',
    ensureAuthenticated,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    partyController.addParticipant,
);

export default partyRouter;

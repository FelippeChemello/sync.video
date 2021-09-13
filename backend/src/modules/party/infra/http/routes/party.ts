import { Router } from 'express';

import PartyController from '../controllers/PartyController';
import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureIsAuthenticated';

const partyRouter = Router();
const partyController = new PartyController();

partyRouter.post('/', ensureAuthenticated, partyController.create);

export default partyRouter;

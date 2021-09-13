import { container } from 'tsyringe';
import { getRepository } from 'typeorm';

import User from '../../modules/users/infra/database/entities/User';
const UsersRepository = getRepository(User);

import Party from '../../modules/party/infra/database/schemas/Party';
const PartyRepository = getRepository(Party, 'mongo');

container.registerInstance('UsersRepository', UsersRepository);

container.registerInstance('PartiesRepository', PartyRepository);

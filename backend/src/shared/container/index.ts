import { container } from 'tsyringe';
import { getRepository } from 'typeorm';

import User from '../../modules/users/infra/database/entities/User';
const UsersRepository = getRepository(User);

container.registerInstance('UsersRepository', UsersRepository);

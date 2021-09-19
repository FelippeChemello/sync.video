import { container } from 'tsyringe';
import { getRepository } from 'typeorm';

import User from '../../modules/users/infra/database/entities/User';
import Party from '../../modules/party/infra/database/entities/Party';
import PartiesUsersRelationship from '../../modules/party/infra/database/entities/PartiesUsersRelationship';

export default function registerRepositories() {
    const UsersRepository = getRepository(User);
    container.registerInstance('UsersRepository', UsersRepository);

    const PartyRepository = getRepository(Party);
    container.registerInstance('PartiesRepository', PartyRepository);

    const PartiesUsersRelationshipRepository = getRepository(PartiesUsersRelationship);
    container.registerInstance(
        'PartiesUsersRelationshipRepository',
        PartiesUsersRelationshipRepository,
    );
}

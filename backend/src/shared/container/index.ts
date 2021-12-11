import { container } from 'tsyringe';
import { getRepository } from 'typeorm';

import User from '../../modules/users/infra/database/entities/User';
import Party from '../../modules/party/infra/database/entities/Party';
import PartiesUsersRelationship from '../../modules/party/infra/database/entities/PartiesUsersRelationship';
import Video from '../../modules/party/infra/database/entities/Video';
import File from '../../modules/file/infra/database/entities/File'
import UserToken from '../../modules/users/infra/database/entities/UserToken';

export default function registerRepositories() {
    const UsersRepository = getRepository(User);
    container.registerInstance('UsersRepository', UsersRepository);

    const PartiesRepository = getRepository(Party);
    container.registerInstance('PartiesRepository', PartiesRepository);

    const PartiesUsersRelationshipRepository = getRepository(
        PartiesUsersRelationship,
    );
    container.registerInstance(
        'PartiesUsersRelationshipRepository',
        PartiesUsersRelationshipRepository,
    );

    const VideosRepository = getRepository(Video);
    container.registerInstance('VideosRepository', VideosRepository);

    const FilesRepository = getRepository(File);
    container.registerInstance('FilesRepository', FilesRepository);

    const UserTokensRepository = getRepository(UserToken);
    container.registerInstance('UserTokensRepository', UserTokensRepository);
}

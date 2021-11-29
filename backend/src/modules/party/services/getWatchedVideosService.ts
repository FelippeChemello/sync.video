import { injectable, inject, container } from 'tsyringe';
import { Repository } from 'typeorm';

import PartiesUsersRelationship from '../infra/database/entities/PartiesUsersRelationship';
import Video from '../infra/database/entities/Video';
import SetMetadataService from './setMetadataService';

interface InterfaceRequestDTO {
    userId: number;
}

@injectable()
export default class GetWatchedVideosService {
    constructor(
        @inject('PartiesUsersRelationshipRepository')
        private partiesUsersRelationshipRepository: Repository<PartiesUsersRelationship>,
    ) {}

    public async execute({ userId }: InterfaceRequestDTO): Promise<Video[]> {
        const partiesThatUserParticipated =
            await this.partiesUsersRelationshipRepository.find({
                where: { userId },
                relations: ['party', 'party.videos'],
            });

        const videosHistory = partiesThatUserParticipated
            .map(party => party.party.videos)
            .reduce((acc, curr) => acc.concat(curr), []);

        return videosHistory;
    }
}

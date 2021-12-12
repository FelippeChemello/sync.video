import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import PartiesUsersRelationship from '../infra/database/entities/PartiesUsersRelationship';
import AppError from '../../../shared/errors/AppError';
import Party from '../infra/database/entities/Party';

interface InterfaceRequestDTO {
    lastOwnerId: number;
    partyId: string;
}

@injectable()
export default class SetNewOwnerInRoomWithoutOwner {
    constructor(
        @inject('PartiesRepository')
        private partiesRepository: Repository<Party>,
    ) {}

    public async execute({
        lastOwnerId,
        partyId,
    }: InterfaceRequestDTO): Promise<PartiesUsersRelationship> {
        const party = await this.partiesRepository.findOne(partyId, {
            relations: ['partiesUsersRelationship'],
        });

        if (!party) {
            throw new AppError('Party not found');
        }

        const newOwner = party.partiesUsersRelationship.find(
            partyUserRelationship =>
                partyUserRelationship.userId !== lastOwnerId &&
                partyUserRelationship.connected,
        );

        if (!newOwner) {
            throw new AppError('No new owner found');
        }

        party.ownerId = newOwner.userId;

        await this.partiesRepository.save(party);

        return newOwner;
    }
}

import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import Party from '../infra/database/entities/Party';
import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    partyId: string;
    userId: number;
}

@injectable()
export default class GetPartyDataService {
    constructor(
        @inject('PartiesRepository')
        private partyRepository: Repository<Party>,
    ) {}

    public async execute({
        partyId,
        userId,
    }: InterfaceRequestDTO): Promise<Party> {
        const party = await this.partyRepository.findOne(partyId, {
            relations: [
                'partiesUsersRelationship',
                'partiesUsersRelationship.user',
                'videos'
            ],
        });

        if (
            !party ||
            !party.partiesUsersRelationship.filter(
                relationship => relationship.user.id === userId,
            )
        ) {
            throw new AppError('Failed to get party data');
        }

        return party;
    }
}

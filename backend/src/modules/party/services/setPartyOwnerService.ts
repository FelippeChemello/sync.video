import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import Party from '../infra/database/entities/Party';
import User from '../../users/infra/database/entities/User';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    partyId: string;
    newOwnerId: number;
    userId: number;
}

@injectable()
export default class setPartyOwnerService {
    constructor(
        @inject('PartiesRepository')
        private partyRepository: Repository<Party>,

        @inject('UsersRepository')
        private userRepository: Repository<User>,
    ) {}

    public async execute({
        partyId,
        userId,
        newOwnerId,
    }: InterfaceRequestDTO): Promise<void> {
        const party = await this.partyRepository.findOne(partyId, {
            relations: [
                'partiesUsersRelationship',
                'partiesUsersRelationship.user',
            ],
        });

        if (!party) {
            throw new AppError('Failed to find Party');
        }

        const isUserOnParty = party.partiesUsersRelationship.find(
            partyUser => partyUser.user.id === userId,
        );

        if (!isUserOnParty) {
            throw new AppError('User is not on Party');
        }

        const isNewOwnerOnParty = party.partiesUsersRelationship.find(
            partyUser => partyUser.user.id === newOwnerId,
        );

        if (!isNewOwnerOnParty) {
            throw new AppError('New Owner is not on Party');
        }

        const newOwner = await this.userRepository.findOne(newOwnerId);

        if (!newOwner) {
            throw new AppError('Failed to find new Owner data');
        }

        party.owner = newOwner;

        await this.partyRepository.save(party);
    }
}

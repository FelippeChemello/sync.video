import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import Party from '../infra/database/entities/Party';
import User from '../../users/infra/database/entities/User';
import PartiesUsersRelationshipRepository from '../infra/database/entities/PartiesUsersRelationship';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    ownerId: number;
}

@injectable()
export default class CreatePartyService {
    constructor(
        @inject('PartiesRepository')
        private partyRepository: Repository<Party>,

        @inject('UsersRepository')
        private userRepository: Repository<User>,

        @inject('PartiesUsersRelationshipRepository')
        private partiesUsersRelationshipRepository: Repository<PartiesUsersRelationshipRepository>,
    ) {}

    public async execute({ ownerId }: InterfaceRequestDTO): Promise<Party> {
        const owner = await this.userRepository.findOne(ownerId);

        if (!owner) {
            throw new AppError('User not found');
        }

        const party = this.partyRepository.create({
            ownerId,
            partiesUsersRelationship: [],
        });

        await this.partyRepository.save(party);

        const userPartyRelashionship =
            this.partiesUsersRelationshipRepository.create({
                party,
                user: owner,
            });

        party.partiesUsersRelationship.push(userPartyRelashionship);

        await this.partiesUsersRelationshipRepository.save(
            userPartyRelashionship,
        );

        return party;
    }
}

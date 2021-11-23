import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';


import PartiesUsersRelationshipRepository from '../infra/database/entities/PartiesUsersRelationship';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    userId: number;
    partyId: string;
    peerId: string;
}

@injectable()
export default class AddPeerIdToUserPartyService {
    constructor(
        @inject('PartiesUsersRelationshipRepository')
        private partiesUsersRelationshipRepository: Repository<PartiesUsersRelationshipRepository>,
    ) {}

    public async execute({
        partyId,
        userId,
        peerId,
    }: InterfaceRequestDTO): Promise<void> {
        const userPartyRelationship =
            await this.partiesUsersRelationshipRepository.findOne({
                where: { userId, partyId },
            });

        if (!userPartyRelationship) {
            throw new AppError('User is not in this party');
        }

        console.log(
            `updating peer ID ${userPartyRelationship.peerId} -> ${peerId}`,
        );

        userPartyRelationship.peerId = peerId;

        await this.partiesUsersRelationshipRepository.save(
            userPartyRelationship,
        );
    }
}

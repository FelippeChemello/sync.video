import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import Party from '../infra/database/entities/Party';
import User from '../../users/infra/database/entities/User';
import PartiesUsersRelationshipRepository from '../infra/database/entities/PartiesUsersRelationship';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    userId: number;
    partyId: string;
    socketId: string;
    peerId: string;
}

@injectable()
export default class AddParticipantService {
    constructor(
        @inject('PartiesRepository')
        private partyRepository: Repository<Party>,

        @inject('UsersRepository')
        private userRepository: Repository<User>,

        @inject('PartiesUsersRelationshipRepository')
        private partiesUsersRelationshipRepository: Repository<PartiesUsersRelationshipRepository>,
    ) {}

    public async execute({
        partyId,
        userId,
        socketId,
        peerId,
    }: InterfaceRequestDTO): Promise<Party> {
        const userToBeAdded = await this.userRepository.findOne(userId);

        if (!userToBeAdded) {
            throw new AppError('User not found');
        }

        const party = await this.partyRepository.findOne(partyId, {
            relations: [
                'partiesUsersRelationship',
                'partiesUsersRelationship.user',
            ],
        });

        if (!party) {
            throw new AppError('Failed to find Party');
        }

        if (
            party.partiesUsersRelationship.find(
                participant => participant.userId === userToBeAdded.id,
            )
        ) {
            const userPartyRelationship =
                await this.partiesUsersRelationshipRepository.findOne({
                    where: { userId, partyId },
                });

            console.log(
                `updating socket ID ${userPartyRelationship?.socketId} -> ${socketId}`,
            );

            console.log(
                `updating peer ID ${userPartyRelationship?.peerId} -> ${peerId}`,
            );

            if (!userPartyRelationship) {
                throw new AppError('Party and User Relationship was not found');
            }

            userPartyRelationship.socketId = socketId;
            userPartyRelationship.peerId = peerId;

            await this.partiesUsersRelationshipRepository.save(
                userPartyRelationship,
            );

            return party;
        }

        console.log('Adding user to party');
        const userPartyRelationship =
            this.partiesUsersRelationshipRepository.create({
                user: userToBeAdded,
                party,
                peerId,
            });

        await this.partiesUsersRelationshipRepository.save(
            userPartyRelationship,
        );

        return party;
    }
}

import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import PartiesUsersRelationship from '../infra/database/entities/PartiesUsersRelationship';
import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    socketId: string;
}

@injectable()
export default class DisconnectUserFromPartyService {
    constructor(
        @inject('PartiesUsersRelationshipRepository')
        private partiesUsersRelationshipRepository: Repository<PartiesUsersRelationship>,
    ) {}

    public async execute({
        socketId,
    }: InterfaceRequestDTO): Promise<PartiesUsersRelationship> {
        const socketData = await this.partiesUsersRelationshipRepository.findOne({
            where: { socketId },
        });

        if (!socketData) {
            throw new AppError('Failed to get socket data');
        }

        socketData.connected = false;

        await this.partiesUsersRelationshipRepository.save(socketData);

        return socketData;
    }
}

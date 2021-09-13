import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import Party from '../infra/database/schemas/Party';

interface InterfaceRequestDTO {
    ownerName: string;
    ownerId: number;
    ownerAvatar: string;
}

@injectable()
export default class CreatePartyService {
    constructor(
        @inject('PartiesRepository')
        private partyRepository: Repository<Party>,
    ) {}

    public async execute({
        ownerAvatar,
        ownerId,
        ownerName,
    }: InterfaceRequestDTO): Promise<Party> {
        const party = new Party({
            avatar: ownerAvatar,
            externalId: ownerId,
            name: ownerName,
        });

        await this.partyRepository.save(party);

        return party;
    }
}

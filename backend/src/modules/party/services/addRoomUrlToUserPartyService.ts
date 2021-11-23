import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import PartyRepository from '../infra/database/entities/Party';
import Party from '../infra/database/entities/Party';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    partyId: string;
    url: string;
}

@injectable()
export default class AddRoomUrlToUserPartyService {
    constructor(
        @inject('PartiesRepository')
        private partiesRepository: Repository<PartyRepository>,
    ) {}

    public async execute({
        partyId,
        url,
    }: InterfaceRequestDTO): Promise<Party> {
        const party = await this.partiesRepository.findOne({
            where: { id: partyId },
        });

        if (!party) {
            throw new AppError('Party not found');
        }

        console.log(`updating Url ${party.roomUrl} -> ${url}`);

        party.roomUrl = url;

        await this.partiesRepository.save(party);

        return party;
    }
}

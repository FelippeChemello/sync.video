import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import Party from '../infra/database/schemas/Party';

interface InterfaceRequestDTO {
    partyId: string;
}

@injectable()
export default class GetPartyDataService {
    constructor(
        @inject('PartiesRepository')
        private partyRepository: Repository<Party>,
    ) {}

    public async execute({ partyId }: InterfaceRequestDTO): Promise<Party[]> {
        const party = await this.partyRepository.find({ id: partyId });

        return party;
    }
}

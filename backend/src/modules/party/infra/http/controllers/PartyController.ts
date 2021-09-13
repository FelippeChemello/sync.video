import { Request, Response } from 'express';
import { container } from 'tsyringe';

import getProfileService from '../../../../users/services/getProfileService';

import CreatePartyService from '../../../services/createPartyService';

export default class PartyController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id: userId } = request.user;

        const { avatar, name, id } = await container
            .resolve(getProfileService)
            .execute({
                userId,
            });

        const party = await container
            .resolve(CreatePartyService)
            .execute({ ownerAvatar: avatar, ownerName: name, ownerId: id });

        return response.json({ party: party.id });
    }
}

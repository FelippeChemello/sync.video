import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePartyService from '../../../services/createPartyService';
import GetPartyDataService from '../../../services/getPartyDataService';
import AddParticipantService from '../../../services/addParticipantService';
import AddRoomUrlToUserPartyService from '../../../services/addRoomUrlToUserPartyService';
import GetWatchedVideosService from '../../../services/getWatchedVideosService';

export default class PartyController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id: userId } = request.user;

        const party = await container
            .resolve(CreatePartyService)
            .execute({ ownerId: +userId });

        return response.json({ party: party.id });
    }

    public async get(request: Request, response: Response): Promise<Response> {
        const { id: userId } = request.user;
        const { id: partyId } = request.params;

        const party = await container
            .resolve(GetPartyDataService)
            .execute({ userId: +userId, partyId: partyId });

        return response.json(classToClass(party));
    }

    public async updateUrl(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id: partyId } = request.params;
        const { url } = request.body;

        const party = await container
            .resolve(AddRoomUrlToUserPartyService)
            .execute({ partyId: partyId, url: `${url}` });

        return response.json(classToClass(party));
    }

    public async addParticipant(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id: userId } = request.user;
        const { id: partyId } = request.params;

        const party = await container
            .resolve(AddParticipantService)
            .execute({ userId: +userId, partyId: partyId, socketId: '' });

        return response.json(classToClass(party));
    }

    public async getVideos(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id: userId } = request.user;

        const videosHistory = await container
            .resolve(GetWatchedVideosService)
            .execute({ userId: +userId });

        return response.json(classToClass(videosHistory));
    }
}

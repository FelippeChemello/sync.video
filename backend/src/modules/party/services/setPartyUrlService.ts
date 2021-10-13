import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import Party from '../infra/database/entities/Party';
import Video from '../infra/database/entities/Video';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    partyId: string;
    url: string;
}

@injectable()
export default class AddParticipantService {
    constructor(
        @inject('PartiesRepository')
        private partyRepository: Repository<Party>,

        @inject('VideosRepository')
        private videoRepository: Repository<Video>,
    ) {}

    public async execute({
        partyId,
        url,
    }: InterfaceRequestDTO): Promise<Video> {
        const party = await this.partyRepository.findOne(partyId, {
            relations: ['videos'],
        });

        if (!party) {
            throw new AppError('Failed to find Party');
        }

        party.videos
            .filter(video => video.isActive === true)
            .forEach(video => (video.isActive = false));

        const videoAlreadyWatched = party.videos.find(
            video => video.url === url,
        );

        if (videoAlreadyWatched) {
            console.log('Video já foi assistido');

            videoAlreadyWatched.second = 0;
            videoAlreadyWatched.isActive = true;

            await this.partyRepository.save(party);

            return videoAlreadyWatched;
        }

        console.log('Adicionando Video novo');

        const newVideo = this.videoRepository.create({
            url,
            party,
            isActive: true,
            second: 0,
        });

        party.videos.push(newVideo);

        await this.partyRepository.save(party);

        return newVideo;
    }
}

import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import Party from '../infra/database/entities/Party';
import Video from '../infra/database/entities/Video';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    partyId: string;
    videoId: number;
    playbackRate: number;
    isPlaying: boolean;
    currentTime: number;
}

@injectable()
export default class setVideoStateService {
    constructor(
        @inject('VideosRepository')
        private videoRepository: Repository<Video>,
    ) {}

    public async execute({
        partyId,
        videoId,
        currentTime,
        isPlaying,
        playbackRate,
    }: InterfaceRequestDTO): Promise<Video> {
        const video = await this.videoRepository.findOne({
            where: { id: videoId, partyId: partyId },
        });

        if (!video) {
            throw new AppError('Video not found');
        }

        video.second = currentTime;
        video.isPlaying = isPlaying;
        video.playbackRate = playbackRate;

        await this.videoRepository.save(video);

        return video;
    }
}

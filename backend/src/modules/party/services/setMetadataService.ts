import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';
import axios from 'axios';

import Video from '../infra/database/entities/Video';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    videoId: number;
}

const emojiRegExp = /\p{Emoji}|[\u0800-\uFFFF]/gu;

@injectable()
export default class SetMetadataService {
    constructor(
        @inject('VideosRepository')
        private videoRepository: Repository<Video>,
    ) {}

    public async execute({ videoId }: InterfaceRequestDTO): Promise<void> {
        const video = await this.videoRepository.findOne(videoId);

        if (!video) {
            throw new AppError('Failed to find Video');
        }

        try {
            const metadata = await axios.post(
                'https://api.apify.com/v2/actor-tasks/vOyjz7XZevjbSmlNF/run-sync-get-dataset-items?token=y2zkrKkqbBNjPxxuEwidwCWwb',
                {
                    url: video.url,
                },
            );

            const data = metadata.data[0];

            video.title = (
                data?.meta?.title ??
                data?.meta?.['og:title'] ??
                data?.meta?.['twitter:title'] ??
                data?.title ??
                ''
            ).replace(emojiRegExp, '');

            video.description = (
                data?.meta?.description ??
                data?.meta?.['og:description'] ??
                data?.meta?.['twitter:description'] ??
                ''
            ).replace(emojiRegExp, '');

            video.uploadedAt = (
                data?.meta?.['og:video:release_date'] || ''
            ).replace(emojiRegExp, '');

            video.thumbnail = (
                data?.meta?.['og:image'] ||
                data?.meta?.['twitter:image'] ||
                ''
            ).replace(emojiRegExp, '');

            await this.videoRepository.save(video);
        } catch (error: any) {
            console.log('erro metadata', error.message); // TODO: monitor this error
        }
    }
}

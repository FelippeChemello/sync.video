import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import File from '../infra/database/entities/File';
import User from '../../users/infra/database/entities/User';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    userId: number;
    fileId: number;
}

@injectable()
export default class GetFileService {
    constructor(
        @inject('FilesRepository')
        private fileRepository: Repository<File>,
    ) {}

    public async execute({
        userId,
        fileId,
    }: InterfaceRequestDTO): Promise<File> {
        const file = await this.fileRepository.findOne({
            where: { userId, id: fileId, isAvailable: true },
        });

        if (!file) {
            throw new AppError('File not found');
        }

        return file;
    }
}

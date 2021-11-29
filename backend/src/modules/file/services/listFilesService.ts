import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import File from '../infra/database/entities/File';
import User from '../../users/infra/database/entities/User';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    userId: number;
}

@injectable()
export default class ListFilesService {
    constructor(
        @inject('FilesRepository')
        private fileRepository: Repository<File>,
    ) {}

    public async execute({
        userId,
    }: InterfaceRequestDTO): Promise<File[]> {
        const files = await this.fileRepository.find({
            where: { userId, isAvailable: true },
        });

        return files;
    }
}

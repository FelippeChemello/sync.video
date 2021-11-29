import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import File from '../infra/database/entities/File';
import User from '../../users/infra/database/entities/User';

import AppError from '../../../shared/errors/AppError';

interface InterfaceRequestDTO {
    fileName: string;
    title: string;
    description: string;
    userId: number;
}

@injectable()
export default class SaveFileService {
    constructor(
        @inject('FilesRepository')
        private fileRepository: Repository<File>,

        @inject('UsersRepository')
        private userRepository: Repository<User>,
    ) {}

    public async execute({
        description,
        fileName,
        title,
        userId,
    }: InterfaceRequestDTO): Promise<File> {
        const user = await this.userRepository.findOne(userId);

        if (!user) {
            throw new AppError('User not found');
        }

        const file = this.fileRepository.create({
            userId,
            title,
            description,
            fileName,
            isAvailable: true,
            expiresAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000), // 1 day
        });

        await this.fileRepository.save(file);

        return file;
    }
}

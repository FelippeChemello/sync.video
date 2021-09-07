import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';

import User from '../infra/database/entities/User';

interface InterfaceRequestDTO {
    userId: string;
}

@injectable()
class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: Repository<User>,
    ) {}

    public async execute({ userId }: InterfaceRequestDTO): Promise<User> {
        const user = await this.usersRepository.findOne(userId);

        if (!user) {
            throw new AppError('User not found');
        }

        return user;
    }
}

export default ShowProfileService;

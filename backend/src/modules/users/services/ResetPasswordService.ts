import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';

import hashConfig from '../../../config/hash';

import AppError from '../../../shared/errors/AppError';

import User from '../infra/database/entities/User';
import UserToken from '../infra/database/entities/UserToken';

interface InterfaceRequestDTO {
    token: string;
    password: string;
}

@injectable()
export default class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: Repository<User>,

        @inject('UserTokensRepository')
        private userTokensRepository: Repository<UserToken>,
    ) {}

    public async execute({
        password,
        token,
    }: InterfaceRequestDTO): Promise<void> {
        const userToken = await this.userTokensRepository.findOne({
            where: { token },
        });

        if (!userToken) {
            throw new AppError('Invalid token', 401);
        }

        const user = await this.usersRepository.findOne({
            where: { id: userToken.userId },
        });

        if (!user) {
            throw new AppError('User not found', 401);
        }

        await this.userTokensRepository.delete(userToken);

        const hashedPassword = await hash(password, hashConfig.bcript.salt);

        user.password = hashedPassword;

        await this.usersRepository.save(user);
    }
}

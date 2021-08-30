import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';

import AppError from '../../../shared/errors/AppError';

import authConfig from '../../../config/auth';
import User from '../infra/database/entities/User';

interface InterfaceRequestDTO {
    email: string;
    password: string;
}

interface InterfaceResponseDTO {
    user: User;
    token: string;
}

@injectable()
export default class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: Repository<User>,
    ) {}

    public async execute({
        email,
        password,
    }: InterfaceRequestDTO): Promise<InterfaceResponseDTO> {
        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;
        if (!secret) {
            throw new AppError('Error at creating token');
        }

        console.log(user, user.id);

        const token = sign({}, secret, {
            subject: `${user.id}`,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

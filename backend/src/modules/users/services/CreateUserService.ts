import { injectable, inject } from 'tsyringe';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import hashConfig from '../../../config/hash';

import AppError from '../../../shared/errors/AppError';

import User from '../infra/database/entities/User';

interface InterfaceRequestDTO {
    name: string;
    email: string;
    password: string;
    avatar: string;
}

@injectable()
export default class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: Repository<User>,
    ) {}

    public async execute({
        name,
        email,
        password,
        avatar,
    }: InterfaceRequestDTO): Promise<User> {
        const checkUserExists = await this.usersRepository.findOne({
            where: { email },
        });

        if (checkUserExists) {
            throw new AppError('Email address already used');
        }

        const hashedPassword = await hash(password, hashConfig.bcript.salt);

        const user = this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
            avatar,
        });

        await this.usersRepository.save(user);

        return user;
    }
}

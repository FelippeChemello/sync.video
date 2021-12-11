import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import nodeMailer from 'nodemailer';

import AppError from '../../../shared/errors/AppError';

import User from '../infra/database/entities/User';
import UserToken from '../infra/database/entities/UserToken';

interface InterfaceRequestDTO {
    email: string;
}

@injectable()
export default class ForgotPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: Repository<User>,

        @inject('UserTokensRepository')
        private userTokensRepository: Repository<UserToken>,
    ) {}

    public async execute({ email }: InterfaceRequestDTO): Promise<string> {
        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new AppError('User not found', 401);
        }

        const resetToken = uuid();

        const userToken = this.userTokensRepository.create({
            userId: user.id,
            token: resetToken,
        });

        await this.userTokensRepository.save(userToken);

        const url = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

        await this.sendForgotPasswordEmail(email, url);

        return resetToken;
    }

    private async sendForgotPasswordEmail(
        to: string,
        url: string,
    ): Promise<void> {
        const sender = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const info = await sender.sendMail({
            from: 'Sync Video <felippe@codestack.me>',
            to,
            subject: 'Recuperação de senha',
            html: `<a href="${url}">Clique aqui</a> para recuperar sua senha`,
        });

        console.log('Message sent: %s', info.messageId);
    }
}

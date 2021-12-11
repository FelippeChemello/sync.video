import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '../../../services/AuthenticateUserService';
import ForgotPasswordService from '../../../services/ForgotPasswordService';
import ResetPasswordService from '../../../services/ResetPasswordService';

export default class SessionsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password } = request.body;

        const { user, token } = await container
            .resolve(AuthenticateUserService)
            .execute({
                email,
                password,
            });

        return response.json({ user: classToClass(user), token });
    }

    public async forgotPassword(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email } = request.body;

        const token = await container
            .resolve(ForgotPasswordService)
            .execute({ email });

        return response.json({ message: 'Email sent', token });
    }

    public async resetPassword(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { token, password } = request.body;

        await container
            .resolve(ResetPasswordService)
            .execute({ token, password });

        return response.json({ message: 'Password changed' });
    }
}

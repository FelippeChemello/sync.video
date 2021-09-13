import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '../../../services/CreateUserService';
import getProfileService from '../../../services/getProfileService';

export default class UsersController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, email, password, avatar } = request.body;

        const user = await container.resolve(CreateUserService).execute({
            name,
            email,
            password,
            avatar,
        });

        return response.json(classToClass(user));
    }

    public async get(request: Request, response: Response): Promise<Response> {
        const { id: userId } = request.user;

        const user = await container.resolve(getProfileService).execute({
            userId,
        });

        return response.json(classToClass(user));
    }
}

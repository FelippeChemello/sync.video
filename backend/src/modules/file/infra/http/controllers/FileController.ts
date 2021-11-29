import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SaveFileService from '../../../services/saveFileService';
import GetFileService from '../../../services/getFileService';
import ListFilesService from '../../../services/listFilesService';

export default class PartyController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id: userId } = request.user;
        const { description, title } = request.body;

        if (!request.file) {
            return response.status(400).json({ error: 'File not found' });
        }

        const file = await container.resolve(SaveFileService).execute({
            userId: +userId,
            fileName: request.file.filename,
            description,
            title,
        });

        return response.json(classToClass(file));
    }

    public async get(request: Request, response: Response): Promise<Response> {
        const { id: userId } = request.user;
        const { id: fileId } = request.params;

        const file = await container
            .resolve(GetFileService)
            .execute({ userId: +userId, fileId: +fileId });

        return response.json(classToClass(file));
    }

    public async getAll(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id: userId } = request.user;

        const files = await container
            .resolve(ListFilesService)
            .execute({ userId: +userId });

        return response.json(classToClass(files));
    }
}

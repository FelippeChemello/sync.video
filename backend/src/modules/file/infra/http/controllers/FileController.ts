import { classToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import formidable from 'formidable';

import apiConfig from '../../../../../config/api';

import SaveFileService from '../../../services/saveFileService';
import GetFileService from '../../../services/getFileService';
import ListFilesService from '../../../services/listFilesService';

export default class PartyController {
    public async create(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<Response> {
        const { id: userId } = request.user;
        const form = formidable(apiConfig.formidable);

        const {
            fields: { title, description },
            files,
        } = await new Promise<{
            fields: formidable.Fields;
            files: formidable.Files;
        }>((resolve, reject) => {
            form.parse(request, (err, fields, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ fields, files });
                }
            });
        });

        const uploadedFile = Array.isArray(files.file)
            ? files.file[0]
            : files.file;

        if (!uploadedFile || !uploadedFile.size || !uploadedFile.newFilename) {
            return response.status(400).json({ error: 'File not found' });
        }

        if (
            !title ||
            typeof title !== 'string' ||
            !description ||
            typeof description !== 'string'
        ) {
            return response
                .status(400)
                .json({ error: 'Title and description are required' });
        }

        const file = await container.resolve(SaveFileService).execute({
            userId: +userId,
            fileName: uploadedFile.newFilename,
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

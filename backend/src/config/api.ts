import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

const uploadFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    url: process.env.API_URL || 'http://localhost:3001',
    uploadFolder,
    multer: {
        storage: multer.diskStorage({
            destination: uploadFolder,
        }),
        preservePath: false,
        filename: (
            req: Request,
            file: Express.Multer.File,
            callback: (error: Error | null, filename: string) => void,
        ) => {
            const fileHash = uuid();
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    },
};

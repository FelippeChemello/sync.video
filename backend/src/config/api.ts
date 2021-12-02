import path from 'path';
import { v4 as uuid } from 'uuid';

const uploadFolder = path.resolve(__dirname, '..', '..', 'tmp');
const maxFileSize = 10 * 1024 * 1024 * 1024; // 10GB

export default {
    url: process.env.API_URL || 'http://localhost:3001',
    uploadFolder,
    formidable: {
        multiples: false,
        uploadDir: uploadFolder,
        allowEmptyFiles: false,
        keepExtensions: true,
        maxFileSize,
        filename: (name, extension, part, form) => {
            return `${uuid()}-${name}${extension}`;
        },
        filter: ({ name: fieldName, originalFileName: fileName, mimetype }) => {
            return mimetype && mimetype.includes('video');
        },
    },
};

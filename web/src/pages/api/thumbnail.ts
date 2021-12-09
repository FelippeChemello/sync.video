import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    res.setHeader('Content-Type', 'image/png');

    try {
        const url = String(req.query.url);

        const image = await axios.get(
            `https://screenshotter-mocha.vercel.app/screenshot?url=${url}&selector=video`,
        );

        res.setHeader(
            'Cache-Control',
            'public, immutable, no-transform, max-age=31536000',
        );
        res.end(image);
    } catch (error) {
        const fallbackImage = await axios.get(
            `${process.env.NEXT_PUBLIC_APP_URL}/assets/video-fallback.png`,
            { responseType: 'arraybuffer' },
        );

        res.end(Buffer.from(fallbackImage.data, 'binary'));
    }
}
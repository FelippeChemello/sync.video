import { NextApiRequest, NextApiResponse } from 'next';
import screenshot from './_lib/screenshot';

export default async function thumbnail(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const url = String(req.query.url);

    try {
        const file = await screenshot(url);
        res.setHeader('Content-Type', `image/png`);
        res.setHeader(
            'Cache-Control',
            `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
        );
        res.statusCode = 200;
        res.end(file);
    } catch (error) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/assets/video-fallback.png`,
        );

        const fallbackImage = await response.arrayBuffer();

        res.end(fallbackImage);
    }
}

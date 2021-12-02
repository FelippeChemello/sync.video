import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const api = axios.create({
    baseURL: 'https://api.daily.co/v1/',
    timeout: 5000,
    headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` },
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const response = await api.post('/rooms', {
            properties: {
                ...req.body,
                exp: Math.round(Date.now() / 1000 + 30 * 60),
            },
        });

        console.log(response.data);

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error); //TODO: Handle with onerelic

        res.status(500).json({});
    }
}

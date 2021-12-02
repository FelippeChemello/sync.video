import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

const chromeExecutablePaths = {
    win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    linux: '/usr/bin/google-chrome',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
};

const chromeExecutablePath = chromeExecutablePaths[process.platform];

const isDev = !process.env.AWS_REGION;

let page: puppeteer.Page | null = null; // Allow to use same instance of puppeteer for all requests while this function is alive

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    res.setHeader('Content-Type', 'image/png');

    try {
        const url = String(req.query.url);

        const image = await screenshot(url);

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

async function screenshot(url: string) {
    const options = {
        args: isDev ? [] : chrome.args,
        executablePath: isDev
            ? chromeExecutablePath
            : await chrome.executablePath,
        headless: isDev ? false : chrome.headless,
    };

    const browser = await puppeteer.launch(options);

    page = await browser.newPage();
    await page.setViewport({ width: 640, height: 360 });
    await page.goto(url);
    await page.evaluate(() => {
        document.querySelector('video').controls = false;
    });
    await page.waitForTimeout(1000);

    const screenshot = await page.screenshot({ type: 'png' });

    return screenshot;
}

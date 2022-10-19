// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { router } from './routes.js';
import * as dotenv from 'dotenv'
dotenv.config()

const headless = process.env.HEADLESS === 'yes' || !!process.env.HEADLESS

console.log({headless})

// throw Error('PAUSE!!')

const startUrls = ['https://bing.com/images/feed'];

const crawler = new PlaywrightCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    headless
    // maxRequestRetries: 200,
});

await crawler.run(startUrls);

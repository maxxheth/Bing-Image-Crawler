import { Dataset, createPlaywrightRouter, EnqueueStrategy } from 'crawlee';

export const router = createPlaywrightRouter();

import fs from 'fs'

import https from 'https'

import * as dotenv from 'dotenv'

dotenv.config()

const download = (url: string) => {
    
    // const path = process.env.FILEPATH as string
    const path = '/var/www/bing-image-crawler/imgs/'
    
    try {

        fs.mkdir(path, err => err)

    } catch (error) {


    } finally {

        const splitUrlFrags = url.split('/')

        const lastFrag = splitUrlFrags[splitUrlFrags.length - 1]

        https.get(url, (res) => {
            const writeStream = fs.createWriteStream(path + lastFrag);

            res.pipe(writeStream);

            writeStream.on("finish", () => {
                writeStream.close();
                console.log("Download Completed!");
            })
        })

    }


}

router.addDefaultHandler(async ({ enqueueLinks, page, log }) => {

    log.info('Kicking off initial scraping task...')

    await page.waitForSelector('.b_searchbox')

    // console.log(process.env.KEYWORD)

    // await page.locator('.b_searchbox').fill(process.env.KEYWORD as string)
    await page.locator('.b_searchbox').fill('hamburgers')
    

    await page.locator('.b_searchboxSubmit').click()

    await page.waitForTimeout(2000)


    const imgUrls = await page.$$eval('a.iusc', (links: HTMLAnchorElement[]) => {

        return links.map(link => link.href)        

    })

    log.info('imgUrls', { imgUrls })

    await enqueueLinks({
        globs: imgUrls, 
        label: 'CAROUSEL'
    })

    

});

router.addHandler('CAROUSEL', async ({ page, log }) => {
    
    log.info('Carousel started')

    await page.waitForSelector('.mainImage.current .overlayContainer')

    try {

        const mainImageSrc = await page.$eval('.mainImage.current .overlayContainer img', (imgElem: HTMLImageElement) => {

            return imgElem.src

        })

        download(mainImageSrc)

    } catch (error) {

        console.log({error})

    } finally {

        /**
         * 
         * Silence is golden. 
         * 
         **/       

    }

    await page.waitForTimeout(3000)

})

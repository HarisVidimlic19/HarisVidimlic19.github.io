import { launch } from 'puppeteer';
import { writeFileSync } from 'fs';

(async () => {
    // Launch a headless browser instance and open new page
    const browser = await launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: "true",
        timeout: 0
    });
    const page = await browser.newPage();

    // Navigate to the URL to scrape
    await page.goto('https://phys.org/physics-news/sort/popular/1w/');

    // Wait for any necessary page content to load
    await page.waitForSelector('.sorted-news-list.px-3');

    // Extract the content of the div container
    const content = await page.$eval('.sorted-news-list.px-3', (div) => div.innerHTML);

    // Extract the content of the div container
    writeFileSync('data/output.html', content);
    // fs.writeFileSync(__dirname + '\\..\\data\\output.html', content);

    console.log('Content extracted and saved to output.html');

    await browser.close();
})();

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // Launch a headless browser instance
    const browser = await stats.puppeteer.launch({
        executablePath: process.env.CHROME_BIN || null,
    });

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the URL you want to scrape
    await page.goto('https://phys.org/physics-news/sort/popular/1w/');

    // Wait for any necessary page content to load (you may need to adjust the selector)
    await page.waitForSelector('.sorted-news-list');

    // Extract the content of the div container
    const content = await page.$eval('.sorted-news-list', (div) => div.innerHTML);

    // Extract the content of the div container
    fs.writeFileSync('./data/output.html', content);

    console.log('Content extracted and saved to output.html');

    await browser.close();
})();
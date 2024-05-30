import puppeteer from 'puppeteer';
import fs from 'fs';

try {
    (async () => {
        const browser = await puppeteer.launch({
            headless: false,
            waitUntil: 'networkidle2',
            timeout: 15000,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--window-size=1208,1329'
            ],
        });
        const page = await browser.newPage();
        // config browser
        await page.setViewport({ width: 1208, height: 1329 });
        // set user agent
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36');
        
        // Save Cookie
        // https://chromewebstore.google.com/detail/export-cookie-json-file-f/nmckokihipjgplolmcmjakknndddifde

        // Read Cookie
        const loadCookie = async (page) => {
            const cookieJson = fs.readFileSync('act.hoyolab.com.cookies.json', 'utf8');
            const cookies = JSON.parse(cookieJson);
            // Set cookies in Puppeteer
            await page.setCookie(...cookies);
        }

        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Load cookie
        await loadCookie(page);

        // normal goto webpage stuff
        await page.goto('https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481');

        // close the first pop up box
        // class="components-home-assets-__sign-guide_---guide-close---2VvmzE"
        await page.waitForSelector('span[class="components-home-assets-__sign-guide_---guide-close---2VvmzE"]');
        await page.click('span[class="components-home-assets-__sign-guide_---guide-close---2VvmzE"]');

        // didn't want to use timeout function
        // but the waitForSelector didn't work in this case
        // have to wait for the cookie to sign in
        await timeout(2000);

        try {
            // hangs for a second when no selector is found
            await page.waitForSelector('.components-home-assets-__sign-content_---has-signed---2brETR');
        } catch {
            // has-signed selector was not found cuz new week started over
            // just click daily check in item
            console.log('here');
            //await page.click('.components-home-assets-__sign-content_---sign-wrapper---38rWqB');
            await page.click('.components-home-assets-__sign-content-test_---actived-day---34r3rb');
            // components-home-assets-__sign-content-test_---actived-day---34r3rb

            // click the success popup box
            // components-common-common-dialog-__index_---dialog-close---1Yc84V
            await page.waitForSelector('.components-common-common-dialog-__index_---dialog-close---1Yc84V');
            await page.click('.components-common-common-dialog-__index_---dialog-close---1Yc84V');

            // doesn't really close
            await browser.close();
        }// rest of the code fires
        console.log('why');

    })()
} catch (err) {
    console.error(err)
}

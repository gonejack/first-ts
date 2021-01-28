import * as puppeteer from 'puppeteer'
import * as fs from "fs";

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://qq.com');
    const session = await page.target().createCDPSession();
    await session.send('Page.enable');
    // @ts-ignore
    const {data} = await session.send('Page.captureSnapshot');
    fs.writeFileSync("qq.mht", data)
    await browser.close();
})();

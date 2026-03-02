/**
 * This template is a production ready boilerplate for developing with `PuppeteerCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

// For more information, see https://docs.apify.com/sdk/js

const { Actor } = require("apify");
const actions = require("./actions");

const {
    PuppeteerCrawler,
    Dataset,
    RequestQueue,
    RequestList,
} = require("crawlee");

Actor.main(async () => {
    const input = await Actor.getInput();
    let reportFileUrl = input.reportFileUrl

    const browser = await actions.getBrowser(input);
    let page = await browser.newPage();
    const success = await actions.login(input, page);
    console.log("login status : ", success);

    if (!success) {
        return;
    }

    const todayUTC = new Date();
    const month = todayUTC.getUTCMonth() + 1; // Months are zero-indexed
    const day = todayUTC.getUTCDate();
    const year = todayUTC.getUTCFullYear();

    const formattedDate = `${month}/${day}/${year}`
    input.reportName = `${reportFileUrl.split('.csv')[0].split('/').pop()}`

    if (!reportFileUrl.includes("enddate")) {
        if (!reportFileUrl.includes("?")) {
            input.reportFileUrl = `${reportFileUrl}?enddate='${formattedDate}'`
        } else {
            input.reportFileUrl = `${reportFileUrl}&enddate='${formattedDate}'`
        }
    }

    let store = await Actor.openKeyValueStore('zenoti-reports');
    await actions.downloadAndPushdata(page, input, store)
});

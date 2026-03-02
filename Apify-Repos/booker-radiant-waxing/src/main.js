/**
 * This template is a production ready boilerplate for developing with `PuppeteerCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

// For more information, see https://docs.apify.com/sdk/js
const { Actor } = require("apify");
const actions = require("./actions");
const { utils } = require("crawlee");

Actor.main(async () => {
    const input = await Actor.getInput();
    input.url = "https://signin.booker.com";

    input.urltoproduct =
        "https://app.secure-booker.com/App/SpaAdmin/Products/Default.aspx";
    input.urltogift =
        "https://app.secure-booker.com/App/BrandAdmin/Spas/Impersonate.aspx?SpaID=28469";

    const dataset = await Actor.openDataset('booker-radiant-waxing');
    await dataset.drop();
    
    const browser = await actions.getBrowser(input);
    let page = await browser.newPage();
    await actions.login(input, page);

    await actions.goToListPage(input, page);
    await actions.extractAllCities(page);

    await page.close();
    await browser.close();
});

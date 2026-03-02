/**
 * This template is a production ready boilerplate for developing with `PuppeteerCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

// For more information, see https://docs.apify.com/sdk/js

const { Actor } = require("apify");
const actions = require("./actions");

var moment = require("moment");
moment().format();
const {
    PuppeteerCrawler,
    Dataset,
    RequestQueue,
    RequestList,
} = require("crawlee");

Actor.main(async () => {
    const input = await Actor.getInput();

    const browser = await actions.getBrowser(input);
    let page = await browser.newPage();
    const success = await actions.login(input, page);
    console.log("login status : ", success);

    if (!success) {
        return;
    }

    const datasetName = `plm-${input.report}`;

    let dataset = await Actor.openDataset(datasetName);
    await dataset.drop();
    dataset = await Actor.openDataset(datasetName);

    console.log("Generating report : ", input.report);
    // DOWNLOAD DIFFERENT REPORTS
    switch (input.report) {
        case "aging":
            return actions.getAgingReport(page, input, dataset);
        case "approved-loans":
            return actions.getApprovedLoansReport(page, input, dataset);
        case "active-loans":
            return actions.getActiveLoansReport(page, input, dataset);
        case "due-loans":
            return actions.getDueLoansReport(page, input, dataset);
        case "leads":
            return actions.getLeadsReport(page, input, dataset);
        case "payments":
            return actions.getPaymentsReport(page, input, dataset);

        default:
            return console.log("Not Found Supported Report Type");
    }
});

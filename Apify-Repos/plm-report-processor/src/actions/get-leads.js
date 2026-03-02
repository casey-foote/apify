const path = require("path");
const { utils } = require("crawlee");
const csvToJson = require("csvtojson");
const fs = require("fs");
const moment = require("moment-timezone");
const TIMEOUT = 1000 * 1200;
const chokidar = require("chokidar");
const downloadAndPushData = require("../utils/download-and-pushdata");

module.exports = async (page, input, dataset) => {
    await page.goto(
        "https://www.checkadvanceusa.net/plm.net/reports/LeadsReport.aspx?reportpreset=default",
        { timeout: TIMEOUT }
    );

    let fromDate = moment().subtract(input.days, "days");
    input.fromDate = fromDate.format("MM/DD/YYYY");
    input.toDate = moment().format("MM/DD/YYYY");

    console.log(
        `Getting data of dates from ${input.fromDate} to ${input.toDate}`
    );
    console.log('Dates displayed in the form "MM/DD/YYYY"');

    // Please set report setting to have default status accepted as checked only. Otherwise page is really heavy.
    // await page.click("#maincontent_StatusRejected");
    // await page.click("#maincontent_StatusError");

    // emptying the input field
    await page.$eval(
        "#maincontent_DateFrom_Date",
        (input) => (input.value = "")
    );
    await page.$eval(
        "#maincontent_DateTo_Date",
        (input) => (input.value = "")
    );

    // typing the dates in input field
    await page.type("#maincontent_DateFrom_Date", input.fromDate);
    await page.type("#maincontent_DateTo_Date", input.toDate);

    //DOWNLOAD DATA AND PUSH IT FROM CSV TO APIFY DATASET
    const exportSelector = "#maincontent_CsvButton";
    await downloadAndPushData(page, input, dataset, exportSelector);

    return Promise.resolve();
};

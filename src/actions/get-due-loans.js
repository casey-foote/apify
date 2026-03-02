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
        "https://www.checkadvanceusa.net/plm.net/reports/LoansReport.aspx?reportpreset=pastdue",
        { timeout: TIMEOUT }
    );

    //DOWNLOAD DATA AND PUSH IT FROM CSV TO APIFY DATASET
    const exportSelector = "#maincontent_ExportButton";
    await downloadAndPushData(page, input, dataset, exportSelector);

    return Promise.resolve();
};

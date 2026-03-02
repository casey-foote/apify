const { Actor } = require("apify");
const path = require("path");
const { utils } = require("crawlee");
const csvToJson = require("csvtojson");
const fs = require("fs");
const moment = require("moment");
const TIMEOUT = 1000 * 1200;
const chokidar = require("chokidar");

const waitForFile = async function waitForFile(filename) {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(filename)) {
            await utils.sleep(2000);
            await waitForFile(filename);
            resolve();
        } else {
            resolve();
        }
    });
};

const handleFileChange = async function handleFileChange(
    filePath,
    dataset,
    input
) {
    console.log("File downloaded: ", filePath.replace("downloads\\", ""));
    const json = await csvToJson().fromFile(filePath);
    console.log(`${json.length} records in ${input.report} Report`);
    if (input.report == 'approved-loans') {
        const store = await Actor.openKeyValueStore(`plm-reports`);
        await store.setValue(`${input.report}.json`, json);
    }
    else {
        //await waitForFile(filePath);
        console.log("Converting data from CSV to Apify Dataset");
        await dataset.pushData(json);
    }
    return Promise.resolve();
};

module.exports = { waitForFile, handleFileChange };

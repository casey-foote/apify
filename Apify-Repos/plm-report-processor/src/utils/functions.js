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
    input,
    extraColumns = {}
) {
    console.log("File downloaded: ", filePath.replace("downloads\\", ""));
    let json = await csvToJson().fromFile(filePath);
    if (Object.keys(extraColumns).length > 0) {
        json = json.map((record) => ({
            ...record,
            ...extraColumns,
        }));
    }

    console.log(`${json.length} records in ${input.report} Report`);
    if (input.report == "approved-loans") {
        const store = await Actor.openKeyValueStore(`plm-reports`);
        const key = `${input.report}.json`;
        const existing = input.resetApprovedLoansStore
            ? []
            : (await store.getValue(key)) || [];
        await store.setValue(key, existing.concat(json));
    }

    console.log("Converting data from CSV to Apify Dataset");
    await dataset.pushData(json);
    return Promise.resolve();
};

module.exports = { waitForFile, handleFileChange };

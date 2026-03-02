const path = require("path");
const { utils } = require("crawlee");
const csvToJson = require("csvtojson");
const { Actor } = require("apify");
const fs = require("fs");

async function waitForFile(filename) {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(filename)) {
            await utils.sleep(3000);
            await waitForFile(filename);
            resolve();
        } else {
            resolve();
        }
    });
}

module.exports = async (page, item, dataset) => {
    //click on export
    const downloadPath = path.resolve("./downloads");

    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
    });
    await page.evaluate(() => {
        document.querySelector(".xSubmit").click();
    });

    //pushing data
    const csvFilePath = "./downloads/Products.csv";
    await waitForFile(csvFilePath);
    const json = await csvToJson().fromFile(csvFilePath);
    for (const i of json) {
        i.location = item.name;
    }
    console.log(`${json.length} records in ${item.name} `);
    await dataset.pushData(json);
    fs.unlinkSync(csvFilePath);
    return Promise.resolve(json.length);
};

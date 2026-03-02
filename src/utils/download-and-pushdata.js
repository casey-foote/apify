const path = require("path");
const { utils } = require("crawlee");
const csvToJson = require("csvtojson");
const fs = require("fs");
const chokidar = require("chokidar");
const { waitForFile, handleFileChange } = require("./functions");

module.exports = async (page, input, dataset, exportSelector) => {
    const csvDirectory = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(csvDirectory)) {
        fs.mkdirSync(csvDirectory);
    }

    // Initializing watcher if the new file gets added to the specified file location
    const watcher = chokidar.watch("./downloads", {
        ignored: /^\./,
        persistent: true,
        awaitWriteFinish: true,
        ignoreInitial: true,
    });

    // Instructing puppeteer to allow download
    const downloadPath = path.resolve("./downloads");
    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
    });

    console.log("Downloading...");
    // Events to perform when Watcher detects file added to the specified location
    const [filePath] = await Promise.all([
        new Promise(async (resolve, reject) => {
            watcher.on("add", (path) => {
                console.log("New file detected.");
                resolve(path);
            });
        }),
        page.evaluate((exportSelector) => {
            document.querySelector(exportSelector).click();
        }, exportSelector),
    ]);

    try {
        await handleFileChange(filePath, dataset, input);
        console.log("Completed");
    } catch (error) {
        console.error(error);
    }
};

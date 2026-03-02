const path = require("path");
const { utils } = require("crawlee");
const csvToJson = require("csvtojson");
const fs = require("fs");
const chokidar = require("chokidar");

module.exports = async (page, input, store) => {
  const handleFileChange = async function handleFileChange(
    filePath,
    store,
    input
  ) {
    const json = await csvToJson().fromFile(filePath);
    console.log("File downloaded: ", filePath.replace("downloads\\", ""));
    console.log(`${json.length} records in ${filePath.replace("downloads\\", "")} `);
    console.log("Converting data from CSV to Apify Dataset");
    await store.setValue(`${input.reportName}.json`, json);
    return Promise.resolve();
  };

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

  console.log("Downloading : ", input.reportFileUrl);
  // Events to perform when Watcher detects file added to the specified location
  const [filePath] = await Promise.all([
    new Promise(async (resolve, reject) => {
      watcher.on("add", (path) => {
        console.log("New file detected.");
        resolve(path);
      });
    }),
    page.goto(input.reportFileUrl, { timeout: 300 * 1000 }),
  ]);

  try {
    await handleFileChange(filePath, store, input);
    console.log("Completed");
  } catch (error) {
    console.error(error);
  }
  fs.unlinkSync(`${csvDirectory}${filePath.replace("downloads", "")}`)
};

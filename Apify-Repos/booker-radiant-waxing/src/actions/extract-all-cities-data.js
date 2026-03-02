const download = require("./download");
const { Actor } = require("apify");

module.exports = async (page) => {
    //collecting all value of particular city
    const listOfAllValues = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll(
                '[name="ctl00$ctl00$ctl00$MasterPageSpaDropDown1$ddlSpa"] option'
            )
        ).map((el) => {
            return {
                value: el["value"],
                name: el.innerText,
            };
        });
    });

    const dataset = await Actor.openDataset('booker-radiant-waxing');

    //loop for each city0
    let total = 0;
    for (const item of listOfAllValues) {
        console.log(`Processing location : ${item.name}`);
        await Promise.all([
            page.waitForNavigation(),
            page.evaluate((i) => {
                $(
                    `select[name="ctl00$ctl00$ctl00$MasterPageSpaDropDown1$ddlSpa"] option[value="${i.value}"]`
                ).prop("selected", true);
                $(
                    '[name="ctl00$ctl00$ctl00$MasterPageSpaDropDown1$ddlSpa"]'
                ).change();
            }, item),
        ]);
        total += await download(page, item, dataset);
    }

    console.log(`Total records found : ${total}`);
    return Promise.resolve(total);
};
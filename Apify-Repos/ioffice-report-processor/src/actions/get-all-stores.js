const TIMEOUT = 1000 * 120;

module.exports = async (input, page) => {
    console.log(`Getting all stores...`);

    await page.goto(`https://ioffice.rogerspos.com/office/plugins/reports/reports_display.php?report=sales_filter.php:sales.php`, {
        timeout: TIMEOUT,
    });

    const stores = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#select-replacer-container ul>li')).map((i) => { return { id: i.id, name: i.innerText }; });
    });
    console.log(`${stores.length} stores found.`);

    return Promise.resolve(stores);
};

const Apify = require('apify');

const TIMEOUT = 1000 * 120;

module.exports = async (input, page, date) => {
    console.log(`generating ${input.report} for ${date.format('YYYY-MM-DD')}`);

    const idMap = {
        TEKBigMetric: '10854',
        TEK2020ALLDATA: '12577',
    };
    const url = `https://ioffice.rogerspos.com/office/plugins/payroll/reports/customexport/custom_export.php?exportname=${input.report}&exportID=${idMap[input.report]}&action=displayStores`;

    await page.goto(url, {
        timeout: TIMEOUT,
    });

    const currentDate = {
        day: date.get('date'),
        month: date.get('month') + 1,
        year: date.get('year'),
    };

    await page.evaluate((dateParts) => {
        document.getElementById('start_day').value = dateParts.day;
        document.getElementById('start_month').value = dateParts.month;
        document.getElementById('start_year').value = dateParts.year;
        document.getElementById('end_day').value = dateParts.day;
        document.getElementById('end_month').value = dateParts.month;
        document.getElementById('end_year').value = dateParts.year;
        const stores = document.getElementById('stores');
        for (let i = 0; i < stores.options.length; i++) {
            stores.options[i].selected = true;
        }
        return dateParts;
    }, currentDate);

    await page.evaluate(() => {
        window.runExport();
    }, currentDate);

    await page.waitForSelector('#contentTable', {
        visible: true,
        timeout: 1000 * 300,
    });

    await Apify.utils.sleep(1000 * 5);

    await Apify.utils.puppeteer.injectJQuery(page);

    await Apify.utils.sleep(1000 * 5);

    const headers = await page.evaluate(() => {
        const items = [];
        $('td', '#contentTable tr.boxBackground').each((index, el) => items.push($(el).text().trim()));
        return items;
    });

    let data = await page.evaluate((titles) => {
        const items = [];
        $('tr:not([class])', '#contentTable').each((index, el) => {
            const obj = {};
            $('td', el).each((i, td) => {
                obj[titles[i]] = $(td).text().trim();
            });
            items.push(obj);
        });
        return items;
    }, headers);

    data = data.filter((i) => i.ReportStartDate);

    data.forEach((item) => {
        item.ReportName = input.report;
        item.captured_at = new Date();
    });

    console.log(`${data.length} items found ${input.report} for ${date.format('YYYY-MM-DD')}`);

    return Promise.resolve(data);
};

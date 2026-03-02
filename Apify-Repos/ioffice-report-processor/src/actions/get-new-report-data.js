const Apify = require('apify');

const TIMEOUT = 1000 * 120;

module.exports = async (input, page, dates, store) => {
    console.log(`generating ${input.report} for ${store.name}`);

    const idMap = {
        ProductSalesDetail: 'product_sales_detail_filter.php:product_sales_detail.php',
    };

    const url = `https://ioffice.rogerspos.com/office/plugins/reports/reports_display.php?report=${idMap[input.report]}`;

    await page.goto(url, {
        timeout: TIMEOUT,
    });

    await page.evaluate((storeId) => {
        document.getElementById('stores_sel').value = storeId;
        document.load_filter.submit();
    }, store.id);

    await page.waitForSelector('input[type="submit"]', {
        visible: true,
        timeout: TIMEOUT,
    });

    const startDate = {
        day: dates[1].get('date'),
        month: dates[1].get('month') + 1,
        year: dates[1].get('year'),
    };

    const endDate = {
        day: dates[0].get('date'),
        month: dates[0].get('month') + 1,
        year: dates[0].get('year'),
    };

    await page.evaluate((range) => {
        document.querySelector('#end_month').value = range.endDate.month;
        document.querySelector('#end_day').value = range.endDate.day;
        document.querySelector('#end_year').value = range.endDate.year;
        document.querySelector('#start_month').value = range.startDate.month;
        document.querySelector('#start_day').value = range.startDate.day;
        document.querySelector('#start_year').value = range.startDate.year;
    }, { startDate, endDate });

    await Apify.utils.sleep(1000 * 2);

    await page.evaluate(() => {
        document.querySelector('input[type="submit"]').click();
    });

    await page.waitForSelector('#report>font.header', {
        visible: true,
        timeout: TIMEOUT,
    });

    await page.waitForSelector('#message_generate', {
        hidden: true,
        timeout: TIMEOUT,
    });

    await Apify.utils.puppeteer.injectJQuery(page);

    const headers = await page.evaluate(() => {
        const items = [];
        $('td', '#report table thead tr').each((index, el) => items.push($(el).text().trim()));
        return items;
    });

    let data = await page.evaluate((titles) => {
        const items = [];
        $('tbody tr', '#report table').each((index, el) => {
            const obj = {};
            $('td', el).each((i, td) => {
                obj[titles[i]] = $(td).text().trim();
            });
            items.push(obj);
        });
        return items;
    }, headers);

    data.forEach((item) => {
        item.ReportName = input.report;
        item.StoreName = store.name;
        item.captured_at = new Date();
    });

    data = data.filter((i) => i.Date !== 'Totals:');

    console.log(`${data.length} items found ${input.report} for ${store.name}`);

    return Promise.resolve(data);
};

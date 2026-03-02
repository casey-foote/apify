// This is the main Node.js source code file of your actor.
// It is referenced from the "scripts" section of the package.json file,
// so that it can be started by running "npm start".

// Import Apify SDK. For more information, see https://sdk.apify.com/
const Apify = require('apify');
const moment = require('moment');
const bluebird = require('bluebird');

const actions = require('./actions');

Apify.main(async () => {
    // Get input of the actor (here only for demonstration purposes).
    // If you'd like to have your input checked and have Apify display
    // a user interface for it, add INPUT_SCHEMA.json file to your actor.
    // For more information, see https://docs.apify.com/actors/development/input-schema
    const input = await Apify.getInput();
    // console.log('Input:');
    // console.dir(input);

    const stats = {};
    const datasetName = `ioffice-${input.report.toLowerCase()}`;
    let dataset = await Apify.openDataset(datasetName);
    await dataset.drop();
    await Apify.utils.sleep(10 * 1000);
    dataset = await Apify.openDataset(datasetName);
    /* Steps */

    const reportMap = {
        TEKBigMetric: 'old',
        TEK2020ALLDATA: 'old',
        ProductSalesDetail: 'new',
    };

    let date = moment(input.date);

    if (reportMap[input.report] === 'old') {
        const browser = await actions.getBrowser(input);
        const page = await browser.newPage();
        await actions.login(input, page);

        const dates = [date.clone()];

        let current = 0;

        while (current < input.days) {
            date = date.add(-1, 'day');
            dates.push(date.clone());
            current++;
        }

        await bluebird.map(dates, async (currentDate) => {
            let counter = 0;
            let currentPage = null;
            while (counter < 3) {
                try {
                    counter++;
                    if (counter > 1) {
                        console.log(`Re-attempting ${input.report} for ${currentDate.format('YYYY-MM-DD')}`);
                    }
                    currentPage = await browser.newPage();
                    const items = await actions.getReportData(input, currentPage, currentDate);
                    await dataset.pushData(items);
                    stats[currentDate.format('YYYY-MM-DD')] = items.length;
                    await currentPage.close();
                    counter = 5;
                } catch (ex) {
                    await currentPage.close();
                    console.error(ex);
                }
            }
        }, { concurrency: input.threads || 1 });

        console.log('Closing Puppeteer...');
        await browser.close();
    } else {
        const dates = [date.clone()];
        date = date.add(-1 * input.days, 'day');
        dates.push(date.clone());
        const browsers = [];
        let page = null;
        for (let i = 0; i < input.threads; i++) {
            const browser = await actions.getBrowser(input);
            page = await browser.newPage();
            await actions.login(input, page);
            browsers.push(browser);
        }

        const stores = actions.getAllStores(input, page);
        console.log(`generating ${input.report} from ${dates[0].format('YYYY-MM-DD')} to ${dates[1].format('YYYY-MM-DD')}`);
        await bluebird.map(stores, async (store) => {
            let items = await Apify.getValue(store.id);
            if (items == null) {
                const browser = browsers.shift();
                let counter = 0;
                let currentPage = null;
                while (counter < 5) {
                    try {
                        counter++;
                        if (counter > 1) {
                            console.log(`Re-attempting ${input.report} for ${store.name}`);
                        }
                        currentPage = await browser.newPage();
                        items = await actions.getNewReportData(input, currentPage, dates, store);
                        await dataset.pushData(items);
                        await Apify.setValue(store.id, items);
                        stats[store.name] = items.length;
                        await currentPage.close();
                        counter = 6;
                    } catch (ex) {
                        await currentPage.close();
                        console.error(ex);
                    } finally {
                        browsers.push(browser);
                    }
                }
            } else {
                console.log(`${store.name} loaded from cache`);
                stats[store.name] = items.length;
                await dataset.pushData(items);
            }
        }, { concurrency: input.threads || 1 });

        for (let i = 0; i < input.threads; i++) {
            await browsers[i].close();
        }
    }

    console.log(`Saving output... : ${Object.keys(stats).length}`);
    await Apify.setValue('OUTPUT', stats);

    console.dir(stats);

    console.log('Done.');
});

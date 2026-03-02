// This is the main Node.js source code file of your actor.

// Import Apify SDK. For more information, see https://sdk.apify.com/
const Apify = require('apify');
const bluebird = require('bluebird');

Apify.main(async () => {
    // Get input of the actor (here only for demonstration purposes).
    const input = await Apify.getInput();
    console.log('Input:');
    console.dir(input);

    let buffer = [];
    let store = await Apify.openKeyValueStore(input.remote, { forceCloud: true });
    for (let index = 1; index <= 10000; index++) {
        const key = `k${index}`;
        buffer.push(key);
        if (buffer.length >= 100) {
            console.log(`Buffer ${buffer.length}`);
            await bluebird.map(buffer, async (currentKey) => {
                const random = Math.floor(Math.random() * 100);
                if (input.action === 'upload') {
                    await store.setValue(currentKey, random);
                }
                else {
                    await store.getValue(currentKey);
                }
            }, { concurrency: input.threads });
            buffer = [];
        }
    }
    console.log(`Process complete`);
});

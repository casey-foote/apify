const Apify = require('apify');

module.exports = async (input) => {
    console.log('Launching browser...');

    const proxyConfiguration = await Apify.createProxyConfiguration(input.proxy);

    return Apify.launchPuppeteer({
        proxyUrl: proxyConfiguration?.newUrl(),
        useChrome: Apify.isAtHome(),
        launchOptions: {
            headless: false,
            defaultViewport: null,
            args: ['--window-size=1920,1080'],
        },
    });
};

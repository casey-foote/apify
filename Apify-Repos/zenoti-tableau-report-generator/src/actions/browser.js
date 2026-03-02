const { Actor } = require("apify");
const { utils, launchPuppeteer } = require("crawlee");

module.exports = async (input) => {
    console.log("Browser launching");
    const proxyConfiguration = await Actor.createProxyConfiguration(
        input.proxy
    );
    return launchPuppeteer({
        proxyUrl: proxyConfiguration?.newUrl(),
        useChrome: Actor.isAtHome(),
        launchOptions: {
            headless: false,
            defaultViewport: null,
            args: [
                "--window-size=1920,1080",
                "--force-device-scale-factor=0.9",
            ],
        },
    });
};

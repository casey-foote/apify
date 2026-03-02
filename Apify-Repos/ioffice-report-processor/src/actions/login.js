const Apify = require('apify');

const TIMEOUT = 1000 * 120;

module.exports = async (input, page) => {
    const url = `https://ioffice.rogerspos.com/office/login.php`;
    await page.goto(url, {
        timeout: TIMEOUT,
    });

    await Apify.utils.sleep(1000 * 2);

    const usernameSelector = 'input[name="username"]';
    const passwordSelector = 'input[name="password"]';
    const submitSelector = 'input[type="submit"]';

    await page.type(usernameSelector, input.username, {
        delay: 20,
    });
    await page.type(passwordSelector, input.password, {
        delay: 20,
    });

    const elementHandle = await page.$(submitSelector);
    console.log(`Signing in...`);
    await elementHandle.click();
    await page.waitForNavigation({
        timeout: TIMEOUT,
    });

    console.log('Loading dashboard...');
    return Apify.utils.sleep(1000 * 3);
};

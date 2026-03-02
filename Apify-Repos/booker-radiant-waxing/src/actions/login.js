const TIMEOUT = 1000 * 120;

module.exports = async (input, page) => {
    await page.goto(input.url, {
        timeout: TIMEOUT,
    });
    // account name page
    const accountNameSelector = 'input[id="AccountName"]';
    const continueSelector = '[type = "submit"]';
    await page.waitForSelector(accountNameSelector, {
        visible: true,
        timeout: 1000 * 60,
    });
    await page.type(accountNameSelector, input.account, {
        delay: 20,
    });
    const continueHandle = await page.$(continueSelector);
    console.log(`Account information entered`);
    await continueHandle.click();

    //next page (login)
    const usernameSelector = 'input[id="Username"]';
    const passwordSelector = 'input[id="Password"]';
    const signInSelector = '[type="submit"]';
    await page.waitForSelector(usernameSelector);

    await page.type(usernameSelector, input.username, {
        delay: 20,
    });
    await page.type(passwordSelector, input.password, {
        delay: 20,
    });

    const signInHandler = await page.$(signInSelector);
    console.log(`Signing in`);
    await signInHandler.click();
    return page.waitForSelector('[id="ctl00_ctl00_content_content_pnlSearch"]');
};

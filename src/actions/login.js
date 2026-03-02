const { utils } = require("crawlee");

const TIMEOUT = 1000 * 120;

module.exports = async (input, page) => {
    await page.goto(`https://www.checkadvanceusa.net/plm.net/`, {
        timeout: TIMEOUT,
    });

    await page.waitForSelector('input[id="maincontent_Username"]', {
        visible: true,
        timeout: 1000 * 60,
    });

    // await utils.sleep(1000 * 3);
    const usernameSelector = 'input[id="maincontent_Username"]';
    const passwordSelector = 'input[id="maincontent_Password"]';
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
    await page.waitForNavigation();

    const isNotHidden = await page.evaluate(() => {
        let error = document.querySelector("tr>td>span[style]");
        return (
            error &&
            window.getComputedStyle(error).getPropertyValue("display") !==
            "none" &&
            error.offsetHeight > 0
        );
    });

    if (isNotHidden) {
        const errorMessage = await page.evaluate(() => {
            return document.querySelector("tr>td>span[style]").innerText;
        });
        console.log(errorMessage);
        return Promise.resolve(false);
    } else {
        console.log("Loading dashboard...");
        // SELECT LOGIN TYPE
        // By Default it is Corporate User
        const loginTypeSelector = 'input[id="maincontent_LoginButton"]';
        const loginHandle = await page.$(loginTypeSelector);
        await loginHandle.click();
        await page.waitForNavigation();
        return Promise.resolve(true);
    }
};

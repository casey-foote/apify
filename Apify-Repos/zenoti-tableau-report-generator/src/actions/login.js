const { utils } = require("crawlee");

const TIMEOUT = 1000 * 120;

module.exports = async (input, page) => {
  await page.goto(`https://supercuts.zenoti.com/Analytics/AnalyticsHome.aspx`, {
    timeout: TIMEOUT,
  });

  await page.waitForSelector('#Username', {
    visible: true,
    timeout: 1000 * 60,
  });

  // await utils.sleep(1000 * 3);
  const usernameSelector = '#Username';
  const passwordSelector = '#Password';
  const submitSelector = 'button[value="login"]';
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

  const viewAllSelector = ".aViewAll"
  await page.waitForSelector(viewAllSelector, {
    visible: true,
    timeout: 1000 * 60,
  });
  console.log("Loading dashboard...");
  const elementHandle2 = await page.$(viewAllSelector);
  await elementHandle2.click();

  // await page.waitForSelector('[data-tb-test-id="recents-channel"]', {
  //   timeout: 1000 * 60,
  // });

  console.log("Navigation completed");

  return Promise.resolve(true);

};

module.exports = async (input, page) => {
    await page.goto(input.urltogift);
    await page.waitForSelector(".xTitleNoBg");

    await page.goto(input.urltoproduct);
    await page.waitForSelector(".xSubmit");
    console.log("Reached on list Page");
};

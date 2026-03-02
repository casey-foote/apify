const moment = require("moment-timezone");
const TIMEOUT = 1000 * 1200;
const downloadAndPushData = require("../utils/download-and-pushdata");

const setAutoApproveFilter = async (page, value) => {
    const normalizedValue = value.toLowerCase();
    const selectedByRow = await page.evaluate((targetValue) => {
        const normalize = (text) =>
            (text || "")
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

        const container = Array.from(document.querySelectorAll("tr, td, div"))
            .filter((element) =>
                normalize(element.textContent).includes("auto approve")
            )
            .filter((element) => {
                const labels = Array.from(element.querySelectorAll("label")).map(
                    (item) => normalize(item.textContent)
                );
                const radios = element.querySelectorAll("input[type=radio]").length;
                return (
                    radios >= 3 &&
                    labels.includes("yes") &&
                    labels.includes("no")
                );
            })
            .sort(
                (left, right) =>
                    normalize(left.textContent).length -
                    normalize(right.textContent).length
            )[0];

        if (!container) return false;

        const label = Array.from(container.querySelectorAll("label")).find(
            (item) => normalize(item.textContent) === targetValue
        );
        if (label) {
            const forId = label.getAttribute("for");
            const targetInput = forId
                ? document.getElementById(forId)
                : label.querySelector("input[type=radio]");

            if (targetInput) {
                targetInput.click();
                return true;
            }
        }

        const radios = Array.from(
            container.querySelectorAll("input[type=radio]")
        );
        const index = targetValue === "yes" ? 1 : 2;
        if (radios[index]) {
            radios[index].click();
            return true;
        }

        return false;
    }, normalizedValue);

    if (selectedByRow) {
        await page.waitForTimeout(500);
        return;
    }

    const fallbackSelectors =
        normalizedValue === "yes"
            ? [
                  "#maincontent_AutoApprove_1",
                  "#maincontent_AutoApproved_1",
                  "input[name*='AutoApprove'][value='Yes']",
                  "input[name*='AutoApprove'][value='true']",
              ]
            : [
                  "#maincontent_AutoApprove_2",
                  "#maincontent_AutoApproved_2",
                  "input[name*='AutoApprove'][value='No']",
                  "input[name*='AutoApprove'][value='false']",
              ];

    for (const selector of fallbackSelectors) {
        const input = await page.$(selector);
        if (!input) continue;

        await input.click();
        await page.waitForTimeout(500);
        return;
    }

    throw new Error(`Unable to set Auto Approve filter to "${value}"`);
};

module.exports = async (page, input, dataset) => {
    await page.goto(
        "https://www.checkadvanceusa.net/plm.net/reports/LoansReport.aspx?reportpreset=approved",
        { timeout: TIMEOUT }
    );

    let fromDate = moment().subtract(input.days, "days");
    input.fromDate = fromDate.format("MM/DD/YYYY");
    input.toDate = moment().format("MM/DD/YYYY");

    console.log(
        `Getting data of dates from ${input.fromDate} to ${input.toDate}`
    );
    console.log('Dates displayed in the form "MM/DD/YYYY"');

    // emptying the input field
    await page.$eval(
        "#maincontent_ApproveDateFrom_Date",
        (input) => (input.value = "")
    );
    await page.$eval(
        "#maincontent_ApproveDateTo_Date",
        (input) => (input.value = "")
    );

    // typing the dates in input field
    await page.type("#maincontent_ApproveDateFrom_Date", input.fromDate);
    await page.type("#maincontent_ApproveDateTo_Date", input.toDate);

    // DOWNLOAD DATA twice: Auto Approve = Yes and No
    const exportSelector = "#maincontent_ExportButton";
    const autoApproveVariants = ["Yes", "No"];

    for (let i = 0; i < autoApproveVariants.length; i++) {
        const autoApproveValue = autoApproveVariants[i];
        console.log(`Running approved-loans for Auto Approve = ${autoApproveValue}`);

        await setAutoApproveFilter(page, autoApproveValue);
        await downloadAndPushData(
            page,
            {
                ...input,
                resetApprovedLoansStore: i === 0,
            },
            dataset,
            exportSelector,
            { "Auto Approve": autoApproveValue }
        );
    }

    return Promise.resolve();
};

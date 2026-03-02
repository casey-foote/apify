module.exports = {
    getBrowser: require("./browser"),
    login: require("./login"),

    // DIFFERENT REPORTS
    getAgingReport: require("./get-aging"),
    getApprovedLoansReport: require("./get-approved-loans"),
    getActiveLoansReport: require("./get-active-loans"),
    getDueLoansReport: require("./get-due-loans"),
    getLeadsReport: require("./get-leads"),
    getPaymentsReport: require("./get-payments"),
};

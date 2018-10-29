const { parseValue } = require("../util/util.js");

/* =====Web Page ==== */
//http://jsjustweb.jihsun.com.tw/z/zc/zce/zce_2912.djhtm


module.exports.extractEarningpower = ($, option) => {
    const { DBG } = option || false;
    let a_Q_TIME = [];
    let a_GrossProfit = [];
    let a_OperatingProfitMargin = [];

    $("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        // console.log($(e).children('td').eq(0).text());
        let [Y, Q] = $(e).children('td').eq(0).text().split('.');
        let time = `${parseValue(Y) + 1911}.${Q}`;
        a_Q_TIME.push(time);

        a_GrossProfit.push(parseValue($(e).children('td').eq(4).text()));
        a_OperatingProfitMargin.push(parseValue($(e).children('td').eq(6).text()));
    });
    // console.log(a_Q_TIME)
    return { a_Q_TIME, a_GrossProfit, a_OperatingProfitMargin};
}


const { parseValue } = require("../util/util.js");

/* =====Web1 Page4==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zcdj_2330.djhtm
module.exports.extractPerformance_Y = ($, option) => {
    const { DBG } = option || false;
    let a_OperatingRevenue_Y = [];
    let a_EPS_Y = [];
    let Y_TIME = []
    $("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        var value = $(e).children('td').eq(2).text();
        var tempEPS = $(e).children('td').eq(7).text();
        // if (i < 2)
            a_OperatingRevenue_Y.push(parseValue(value));
        // if (i < 2) {
            a_EPS_Y.push(parseValue(tempEPS));
            Y_TIME.push(parseValue($(e).children('td').eq(0).text())+1911);
        // }
        // console.log(i,parseInt(value));
    });
    if (DBG) console.log("營業收入:", YearEarningLastY);
    if (DBG) console.log("(去年)稅後每股盈餘(EPS)(元):", a_EPS_Y);
    return {
        a_OperatingRevenue_Y,
        a_EPS_Y,
        Y_TIME
    }
}

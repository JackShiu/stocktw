const { parseValue } = require("../util/util.js");

/* =====Web1 Page4==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zcdj_2330.djhtm
module.exports.extractPerformance_Y = ($, option) => {
    const { DBG } = option || false;
    let YearEarningLastY;
    let EPSYear = [];
    $("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        var value = $(e).children('td').eq(2).text();
        var tempEPS = $(e).children('td').eq(7).text();
        if (i < 1)
            YearEarningLastY = parseValue(value);
        if (i < 2)
            EPSYear.push(parseValue(tempEPS));
        // console.log(i,parseInt(value));
    });
    if (DBG) console.log("營業收入:", YearEarningLastY);
    if (DBG) console.log("(去年)稅後每股盈餘(EPS)(元):", EPSYear);
    return {
        YearEarningLastY,
        EPSYear
    }
}

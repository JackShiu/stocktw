const { parseValue } = require("../util/util.js");

/* =====Web1 Page 2==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zch/zch_2330.djhtm

module.exports.extractRevenueMonthly = ($, option) => {
    const { DBG } = option || false;
    let profitMonthYoY = [];
    $("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        var value = $(e).children('td').eq(4).text();
        if (i < 6) //only exact the six latest value
            profitMonthYoY.push(parseValue(value));
        // console.log(i,parseValue(value));
    });
    if (DBG) console.log("年增率(%):", profitMonthYoY);
    return ({ profitMonthYoY });
}
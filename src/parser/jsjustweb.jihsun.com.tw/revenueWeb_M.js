const { parseValue } = require("../util/util.js");

/* =====Web1 Page 2==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zch/zch_2330.djhtm

module.exports.extractRevenueMonthly = ($, option) => {
    const { DBG } = option || false;
    let a_OperatingRevenue_M_YoY = [];
    let M_TIME = []
    let a_OperatingRevenue_M = [];
    $("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        var [Y,M] = $(e).children('td').eq(0).text().split("/");//107-07
        if (i < 24) { //only exact the six latest value
            a_OperatingRevenue_M.push(parseValue($(e).children('td').eq(1).text())); //單位: 千元
            a_OperatingRevenue_M_YoY.push(parseValue($(e).children('td').eq(4).text()));
            M_TIME.push(`${parseValue(Y) + 1911}.${M}`);//2018.07
        }
        // console.log(i,parseValue(value));
    });
    if (DBG) console.log("年增率(%):", profitMonthYoY);
    return ({
        a_OperatingRevenue_M_YoY,
        a_OperatingRevenue_M,
        M_TIME
     });
}
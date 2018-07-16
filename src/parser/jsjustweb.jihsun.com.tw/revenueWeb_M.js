const { parseValue } = require("../util/util.js");

/* =====Web1 Page 2==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zch/zch_2330.djhtm

module.exports.extractRevenueMonthly = ($, option) => {
    const { DBG } = option || false;
    let profitMonthYoY =[];
    let monthV = []
    profitMonthValue = [];
    $("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        //var month = $(e).children('td').eq(0).text().split("/");
        var [Y,M] = $(e).children('td').eq(0).text().split("/");//107-07
        var value = $(e).children('td').eq(4).text();
        if (i < 6) { //only exact the six latest value
            profitMonthYoY.push(parseValue(value));
            monthV.push(`${parseValue(Y) + 1911}.${M}`);//2018.07
            profitMonthValue.push(parseValue($(e).children('td').eq(1).text())); //單位: 千元
        }
        // console.log(i,parseValue(value));
    });
    if (DBG) console.log("年增率(%):", profitMonthYoY);
    return ({
        profitMonthYoY,
        profitMonthValue,
        month: monthV
     });
}
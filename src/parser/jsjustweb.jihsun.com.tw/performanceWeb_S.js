const { parseValue } = require("../util/util.js");

/* =====Web1 Page 3==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zcd_2330.djhtm
module.exports.extractPerformance_S = ($, option) => {
    const { DBG } = option || false;
    let OperatingRevenueMonth = [];
    let NetProfit = [];
    let Capital;
    $("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        var value = $(e).children('td').eq(2).text();
        var tempProfitRatio = $(e).children('td').eq(4).text();
        if (i < 4) //only exact the four latest value
            OperatingRevenueMonth.push(parseValue(value));
        if (i < 4)
            NetProfit.push(parseValue(tempProfitRatio));
        // console.log(i,parseValue(value));
        if (i < 1)
            Capital = parseValue($(e).children('td').eq(1).text());
    });
    if (DBG) console.log("(過去)營業收入(元/季):", OperatingRevenueMonth);
    if (DBG) console.log("(過去)稅後淨利(元/季):", NetProfit);
    if (DBG) console.log("股本:", Capital);
    return ({
        OperatingRevenueMonth,
        NetProfit,
        Capital
    });
}

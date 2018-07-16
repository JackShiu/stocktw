const { parseValue } = require("../util/util.js");

/* =====Web1 Page 3==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zcd_2330.djhtm
module.exports.extractPerformance_S = ($, option) => {
    const { DBG } = option || false;
    let OperatingRevenueQuarterly = [];
    let NetProfit_afterTax = [];
    let NetProfit_beforTax = [];
    let EPS_afterTax = [];
    let EPS_beforeTax = [];
    let Capital =[];
    let Quarter = [];
    $("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        if (i < 4) {//only exact the four latest value
            // var [year, Q] = $(e).children('td').eq(0).text().split(".");
            var [Y,Q] = $(e).children('td').eq(0).text().split('.'); //107.1Q
            Quarter.push(`${parseValue(Y) + 1911}.${Q}`); // 2018.1Q
            OperatingRevenueQuarterly.push(parseValue($(e).children('td').eq(2).text()));
            NetProfit_afterTax.push(parseValue($(e).children('td').eq(4).text()));
            NetProfit_beforTax.push(parseValue($(e).children('td').eq(3).text()));
            EPS_afterTax.push(parseValue($(e).children('td').eq(7).text()));
            EPS_beforeTax.push(parseValue($(e).children('td').eq(6).text()));
            Capital.push(parseValue($(e).children('td').eq(1).text()));
        }
        // console.log(i,parseValue(value));
        // if (i < 1)
    });
    if (DBG) console.log("(過去)營業收入(元/季):", OperatingRevenueQuarterly);
    if (DBG) console.log("(過去)稅後淨利(元/季):", NetProfit);
    if (DBG) console.log("股本:", Capital);
    return ({
        OperatingRevenueQuarterly,
        NetProfit_afterTax,
        NetProfit_beforTax,
        EPS_afterTax,
        EPS_beforeTax,
        Capital,
        Quarter
    });
    // 單位：千股 / 百萬元
}

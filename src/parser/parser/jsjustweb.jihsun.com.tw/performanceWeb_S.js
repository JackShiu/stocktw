const { parseValue } = require("../util/util.js");

/* =====Web1 Page 3==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zcd_2330.djhtm
module.exports.extractPerformance_S = ($, option) => {
    const { DBG } = option || false;
    let a_OperatingRevenue_Q = [];
    let a_NetIncome_Q_afterTax = [];
    let a_NetIncome_Q_beforTax = [];
    let EPS_afterTax = [];
    let EPS_beforeTax = [];
    let a_Capital_Q =[];
    let Q_TIME = [];
    $("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        // if (i < 4) {//only exact the four latest value
            // var [year, Q] = $(e).children('td').eq(0).text().split(".");
            var [Y,Q] = $(e).children('td').eq(0).text().split('.'); //107.1Q
            Q_TIME.push(`${parseValue(Y) + 1911}.${Q}`); // 2018.1Q
            a_OperatingRevenue_Q.push(parseValue($(e).children('td').eq(2).text()));
            a_NetIncome_Q_afterTax.push(parseValue($(e).children('td').eq(4).text()));
            a_NetIncome_Q_beforTax.push(parseValue($(e).children('td').eq(3).text()));
            EPS_afterTax.push(parseValue($(e).children('td').eq(7).text()));
            EPS_beforeTax.push(parseValue($(e).children('td').eq(6).text()));
            a_Capital_Q.push(parseValue($(e).children('td').eq(1).text()));
        // }
        // console.log(i,parseValue(value));
        // if (i < 1)
    });
    if (DBG) console.log("(過去)營業收入(元/季):", a_OperatingRevenue_Q);
    if (DBG) console.log("(過去)稅後淨利(元/季):", NetProfit);
    if (DBG) console.log("股本:", a_Capital_Q);
    return ({
        a_OperatingRevenue_Q,
        a_NetIncome_Q_afterTax,
        a_NetIncome_Q_beforTax,
        a_EPS_Q : EPS_afterTax,
        a_Capital_Q,
        Q_TIME
    });
    // 單位：千股 / 百萬元
}

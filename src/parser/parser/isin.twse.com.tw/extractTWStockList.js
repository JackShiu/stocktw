const { parseValue } = require("../util/util.js");

/* =====Web2 Page1====
    上市 股票 ID
    http://isin.twse.com.tw/isin/C_public.jsp?strMode=2
*/
module.exports.extractTockExchangeMarketList = ($, option) => {
    const { DBG } = option || false;
    let data = [];
    $("table tr ").not("tr[align='center']").each((i, e) => {
        let cur = $(e).children('td').not("td [colspan='7']").eq(0).text().split(/[\s,]+/);
        //只抓 "股票" 而已
        if (cur[1] === "上市認購(售)權證") return false;
        let ID = parseValue(cur[0]);
        if (ID !== -1) {
            let Name = cur[1];
            let Type = $(e).children('td').not("td [colspan='7']").eq(3).text();
            let Category = $(e).children('td').not("td [colspan='7']").eq(4).text();
            data.push({ ID, Name, Type, Category });
            // console.log(`ID:${ID} Name:${Name} Type:${Type} Category:${Category}`);

        }
    });
    return data
}

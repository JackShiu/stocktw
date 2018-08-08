const { parseValue } = require("../util/util.js");

/* =====Web2 Page1====
    上櫃 股票 ID
    http://isin.twse.com.tw/isin/C_public.jsp?strMode=4
*/
module.exports.extractOvertheCounterMarketList = ($, option) => {
    const { DBG } = option || false;
    let isValid = false;
    let data = [];
    $("table tr ").each((i, e) => {
        let cur = $(e).children('td').not("td [colspan='7']").eq(0).text().split(/[\s,]+/);
        // console.log(cur)
        /* 只抓 股票 到 臺灣存託憑證 區間內的 上櫃公司*/
        if (cur[1] ==="股票") isValid = true;
        if (cur[1] ==="臺灣存託憑證") isValid = false;
        let ID = parseValue(cur[0]);
        if (isValid && ID !== -1) {
            let Name = cur[1];
            let Type = $(e).children('td').not("td [colspan='7']").eq(3).text();
            let Category = $(e).children('td').not("td [colspan='7']").eq(4).text();
            data.push({ ID, Name, Type, Category});
            // console.log(`ID:${ID} Name:${Name} Type:${Type} Category:${Category}`);
        }
    });
    // console.log(data,data.length)
    return data
}


const { parseValue } = require("../util/util.js");

/* =====Web2 Page1==== */
module.exports.extractTWStockList = ($, option) => {
    const { DBG } = option || false;
    let data = [];
    $("table tr ").not("tr[align='center']").each((i, e) => {
        let cur = $(e).children('td').not("td [colspan='7']").eq(0).text().split(/[\s,]+/);
        // console.log(i,cur)
        //只抓 "股票" 而已
        if (cur[1] === "上市認購(售)權證") return false;

        if (parseValue(cur[0]) !== -1) {
            // console.log(i,cur[0]);
            data.push(parseValue(cur[0]));
        }
    });
    return data
}

const { parseValue } = require("../util/util.js");

/* =====Web1 Page 1==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_2330.djhtm

module.exports.extractBasicInfo = ($, option) => {
    const {DBG} = option || false;
    let H_PER = [];
    let L_PER = [];
    let currentStartStockValue; //Current start Stock Value
    let currentStockValue; //Current Stock Value
    let currentPERValue; // Current PER Value
    let stockName; //stock name
    let ProductType;
    $(".t01 td").each((i, e) => {
        var value = $(e).text();
        // console.log(i,value)
        switch (value) {
            case "開盤價":
                currentStartStockValue = parseValue($(e).next().text());
                if (DBG) console.log("開盤價:", currentStartStockValue);
                break;
            case "收盤價":
                currentStockValue = parseValue($(e).next().text());
                if (DBG) console.log("收盤價:", currentStockValue);
                break;
            case "本益比":
                currentPERValue = parseValue($(e).next().text());
                if (DBG) console.log("本益比:", currentPERValue);
                break;
            case "最高本益比":
                $(e).parent().children('td').each((index, node) => {
                    if (index != 0 && index < 6) //first is string  and extract six year value
                        H_PER.push(parseValue($(node).text()));
                });
                if (DBG) console.log("最高本益比:", H_PER);
                break;
            case "最低本益比":
                $(e).parent().children('td').each((index, node) => {
                    if (index != 0 && index < 6) //first is string and extract six year value
                        L_PER.push(parseValue($(node).text()));
                });
                if (DBG) console.log("最低本益比:", L_PER);
                break;
            case "營收比重":
                ProductType = ($(e).next().text());
                if (DBG) console.log("營收比重:", ProductType);
                break;
            default:
                //第一個是股票資訊，擷取股票名稱
                if (i == 0) {
                    stockName = e.children[0].data.split(/[\s,\t,\n]+/).join("").slice(0, -4);
                    if (DBG) console.log(stockName)
                    if (stockName === undefined || stockName === "") {
                        if (DBG) console.log($("option").eq(0).text());
                        stockName = $("option").eq(0).text();
                    }
                }
                break;
        }
    });
    return ({
        currentStartStockValue,
        currentStockValue,
        currentPERValue,
        H_PER,
        L_PER,
        stockName,
        ProductType
    });
}

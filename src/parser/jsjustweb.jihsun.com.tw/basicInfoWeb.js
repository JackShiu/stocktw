const { parseValue } = require("../util/util.js");

/* =====Web1 Page 1==== */
// http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_2330.djhtm

module.exports.extractBasicInfo = ($, option) => {
    const {DBG} = option || false;
    let Y_TIME = [];
    let a_H_PER = [];
    let a_L_PER = [];
    let currentStartStockValue; //Current start Stock Value
    let s_closingPrice; //Current Stock Value
    let s_current_PE; // Current PER Value
    let s_stockName; //stock name
    let s_ProductType;
    $(".t01 td").each((i, e) => {
        var value = $(e).text();
        // console.log(i,value)
        switch (value) {
            case "開盤價":
                currentStartStockValue = parseValue($(e).next().text());
                if (DBG) console.log("開盤價:", currentStartStockValue);
                break;
            case "收盤價":
                s_closingPrice = parseValue($(e).next().text());
                if (DBG) console.log("收盤價:", s_closingPrice);
                break;
            case "本益比":
                s_current_PE = parseValue($(e).next().text());
                if (DBG) console.log("本益比:", s_current_PE);
                break;
            case "最高本益比":
                $(e).parent().children('td').each((index, node) => {
                    if (index != 0 ) //first is string  and extract six year value
                        a_H_PER.push(parseValue($(node).text()));
                });
                if (DBG) console.log("最高本益比:", a_H_PER);
                break;
            case "最低本益比":
                $(e).parent().children('td').each((index, node) => {
                    if (index != 0 ) //first is string and extract six year value
                        a_L_PER.push(parseValue($(node).text()));
                });
                if (DBG) console.log("最低本益比:", a_L_PER);
                break;
            case "年度":
                $(e).parent().children('td').each((index, node) => {
                    if (index != 0 ) //first is string and extract six year value
                        Y_TIME.push(parseValue($(node).text()));
                });
            break;
            case "營收比重":
                s_ProductType = ($(e).next().text());
                if (DBG) console.log("營收比重:", s_ProductType);
                break;
            default:
                //第一個是股票資訊，擷取股票名稱
                if (i == 0) {
                    s_stockName = e.children[0].data.split(/[\s,\t,\n]+/).join("").slice(0, -4);
                    if (DBG) console.log(s_stockName)
                    if (s_stockName === undefined || s_stockName === "") {
                        if (DBG) console.log($("option").eq(0).text());
                        s_stockName = $("option").eq(0).text();
                    }
                }
                break;
        }
    });
    return ({
        s_closingPrice,
        s_current_PE,
        a_H_PER,
        a_L_PER,
        Y_TIME,
        s_stockName,
        s_ProductType
    });
}

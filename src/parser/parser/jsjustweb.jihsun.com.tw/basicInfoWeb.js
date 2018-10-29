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

    let s_Capital;
    let s_DailyPricing;
    let s_ROI_W;
    let s_ROI_M;
    let s_Dividend;
    let s_DividendYield;
    let s_DebtRatio;
    let s_PBR;
    let s_D_TIME;
    let s_Q_TIME;
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
                        Y_TIME.push(parseValue($(node).text()) + 1911);
                });
            break;
            case "營收比重":
                s_ProductType = ($(e).next().text());
                if (DBG) console.log("營收比重:", s_ProductType);
                break;
            case "股本(億, 台幣)":
                s_Capital = parseValue($(e).next().text());
                if (DBG) console.log("股本(億, 台幣):", s_Capital);
                break;
            case "漲跌":
                s_DailyPricing = parseValue($(e).next().text());
                if (DBG) console.log("漲跌", s_DailyPricing);
                break;
            case "最近一週":
                s_ROI_W = parseValue($(e).next().text());
                if (DBG) console.log("最近一週", s_ROI_W);
                break;
            case "最近一個月":
                s_ROI_M = parseValue($(e).next().text());
                if (DBG) console.log("最近一個月", s_ROI_M);
                break;
            case "現金股利(元)":
                s_Dividend = parseValue($(e).next().text());
                if (DBG) console.log("現金股利(元)", s_Dividend);
                break;
            case "殖利率":
                s_DividendYield = parseValue($(e).next().text());
                if (DBG) console.log("殖利率", s_DividendYield);
                break;
            case "負債比例":
                s_DebtRatio = parseValue($(e).next().text());
                if (DBG) console.log("負債比例", s_DebtRatio);
                break;
            case "股價淨值比":
                s_PBR = parseValue($(e).next().text());
                if (DBG) console.log("股價淨值比", s_PBR);
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
                } else {
                    let temp = $(e).text();
                    if (temp.includes("投資報酬率")){
                        let date = temp.split(/[(,)]+/);
                        // console.log(date[1]); // 10/30
                        s_D_TIME = date[1];
                    } else if (temp.includes("財務比例")){
                        let [Y, Q] = temp.split(/[(,)]+/)[1].split(".");
                        // console.log(`${parseValue(Y) + 1911}-Q${parseValue(Q)}`); //2018-Q1
                        s_Q_TIME = `${parseValue(Y) + 1911}.${parseValue(Q)}Q`;
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
        s_ProductType,
        s_Capital,
        s_DailyPricing,
        s_ROI_W,
        s_ROI_M,
        s_Dividend,
        s_DividendYield,
        s_DebtRatio,
        s_PBR,
        s_D_TIME,
        s_Q_TIME
    });
}

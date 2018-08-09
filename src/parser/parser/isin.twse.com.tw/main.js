const moment = require("moment")
const { extractTockExchangeMarketList} = require("./extractTWStockList");
const { extractOvertheCounterMarketList} = require("./OvertheCounterMarketList");
const { queryService } = require("../util/util");
const { readJASON, writeJASON} = require("../../fs/fs");

const fileName = "src/data/list.json";
const dateNow = moment().format("YYYY-MM");
let a_AllStock = [];


/* 獲取[上市]公司股票ID*/
module.exports.getStockExchangeMarketList = getStockExchangeMarketList = async (option) => {
        /* 本國上市證券國際證券辨識號碼 的網址 */
    const url = "http://isin.twse.com.tw/isin/C_public.jsp?strMode=2";
    return await queryService(url, extractTockExchangeMarketList, option);
}

/* 獲取[上櫃]公司股票ID*/
module.exports.getOvertheCounterMarketList = getOvertheCounterMarketList = async (option) => {
    /* 本國上市證券國際證券辨識號碼 的網址 */
    const url = "http://isin.twse.com.tw/isin/C_public.jsp?strMode=4";
    return await queryService(url, extractOvertheCounterMarketList, option);
}


module.exports.getTWStockList = getTWStockList = async (option) => {
    let fetchObject = readJASON(fileName) || {};
    let dataDB = fetchObject.date;
    if (dataDB !== dateNow) {
        // 上市
        let parseInfo =  await getStockExchangeMarketList(option) ||[];
        // 上櫃
        let parseInfo1 = await getOvertheCounterMarketList(option) ||[];
        // 兩個網頁的資料串接再一起
        a_AllStock = parseInfo.concat(parseInfo1);
        // 將抓到的資料存起來
        writeJASON(fileName, { date: dateNow, data: a_AllStock });
        return a_AllStock;
    }
    //將抓到的資料暫存起來
    a_AllStock = fetchObject.data.slice();
    return fetchObject;

}

// 只 回傳股票 ID
module.exports.getStockIDList = async (option) => {
    await getTWStockList(option);
    return a_AllStock.map(info => info.ID);
}

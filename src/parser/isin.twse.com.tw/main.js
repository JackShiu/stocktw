
const { extractTWStockList} = require("./extractTWStockList");
const { queryService } = require("../util/util");
const { readJASON, writeJASON} = require("../../fs/fs");

/* 獲取所有上市股票ID
   擷取一次後會存進檔案，以月的方式區分，每個月會重新刷新一次
*/
module.exports.getTWStockList = async (option) => {
    /* 本國上市證券國際證券辨識號碼 的網址 */
    const url = "http://isin.twse.com.tw/isin/C_public.jsp?strMode=2";
    let date = new Date()
    let dateNow = `${date.getFullYear()}-${date.getMonth() + 1}`;

    let val = readJASON("src/data/list.jason");
    let dateStore = val === null ? -1 : val.date;
    if (val === null || dateStore != dateNow) {
        let allStock = await queryService(url, extractTWStockList,option);
        writeJASON("src/data/list.jason", { date: dateNow, data: allStock })
        return allStock;
    }
    return val.data;
};
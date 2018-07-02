let delay = require("await-delay");

const { calculate } = require("./calculate");
const { getStockData } = require("../parser/jsjustweb.jihsun.com.tw/main");
const { getTWStockList } = require("../parser/isin.twse.com.tw/main");
const { saveData } = require("../fs/fs");

/*評估方式一： 計算單一類股*/
module.exports.evaluate = evaluate = async (stockID, options) => {
    const { DBG } = options || false;
    if (DBG) console.log(`=====開始抓取網路資料:${stockID}====`)
    /*獲取server資料*/
    const data = await getStockData(stockID, options);
    /*計算單股各個數值*/
    return calculate(data, options);
};

/*評估方式二： 計算所以類股*/
module.exports.calculateAll = async (stockID, options) => {
    console.log("計算全部");
    let storeString = {};
    // 抓取所有股票
    let data = await getTWStockList(stockID);
    data = data.slice(options.travelingBeginIndex);

    // 遍例抓取的股票陣列
    /* promise 序列化函數 */
    const promiseSerial = funcs =>
        funcs.reduce((promise, func) =>
            promise.then(result => func().then(Array.prototype.concat.bind(result))),
            Promise.resolve([]));
    /* 定義每個promise處理函數*/
    const funcs = data.map(
        stock => async () => {
            try {
                let value = await evaluate(stock, options);
                /*除非要求存檔全部，不然只存有效資料*/
                if (options.allData | value.valid) {
                    return Promise.resolve({ data: value.data, riskEarningRatio: value.riskEarningRatio })
                }
                //設定延遲時間
                await delay(parseInt(200 * Math.random()))
            } catch (e) {
                console.log(`fail at : ${stock}`);
                let date = new Date();
                let currentTime = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                saveData("./out/fail.txt", `${currentTime} {${stock}} : ${e}\n`, "APPEN");
            }
            return Promise.resolve({ data: false, riskEarningRatio: -1 })

        })
    /*濾出有效資料，並且排序*/
    let reqData = (await promiseSerial(funcs))
        .filter(val => val.data != false)
        .sort((a, b) => b.riskEarningRatio - a.riskEarningRatio);
    /*物件串接*/
    storeString.data = reqData.map(val => val.data).reduce((acc, val) => acc.concat(val));
    // console.log(storeString.data);
    return storeString
}

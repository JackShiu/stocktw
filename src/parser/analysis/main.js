let delay = require("await-delay");
let moment =require("moment");
const { storeStockInfo } = require("../fs/fs");
const { parseValue } = require("../parser/util/util");

const { calculate, reset } = require("./calculate");
const {
    getWebAddress,
    getBasicInfoWeb,
    getRevenueWeb_M,
    getPerformanceWeb_S,
    getPerformanceWeb_Y,
    getInstitutionalInvestor,
    getCandlestickChart,
    getEarningpower
} = require("../parser/jsjustweb.jihsun.com.tw/main");
const mStockInfoUpdater = require('./StockInfoUpdater');
const { getStockIDList } = require("../parser/isin.twse.com.tw/main");
const { saveData, readJASON, writeJASON } = require("../fs/fs");

const {stockInfo} = require("../../interface/stockInfo");

/* promise 序列化函數 */
const promiseSerial = funcs =>
    funcs.reduce((promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]));

// 用來暫存 所有stock 的歷史資料
const dateNow = moment().format("YYYY-MM-DD");

/*
2013年起，因應IFRS新制，
台灣的上市公司財報公布時間有所修正:
營收: 每月10日以前，但改成合併營收
第一季季報: 5 / 15以前(原本為4 / 30前)
第二季季報: 8 / 14以前(取消原本8 / 31前公布的半年報!!)
第三季季報: 11 / 14以前(原本為10 / 31前)
年報: 隔年3 / 31以前
*/
const getLastYear = ()=>{
    return moment()
      .subtract(1, "year")
      .year();//2018
}
const getLastMonth =()=>{
    return moment()
      .subtract(1, "month")
      .format("YYYY.MM");//2018.07
}
const getLastQuarter = () => {
    return moment()
      .subtract(1, "quarter")
    //   .subtract(1, "month") //往前在推1個月
    //   .subtract(10, "day") //往前在推又15天
      .format("YYYY.Q[Q]");//2018.2Q

}

const getToday = () => {
    return moment()
    .format("MM/DD"); //10/15
}

const historcialDataFile = "src/data/all_stock_value.json";
let o_ParsedStockInfoObject = {};

const readHistorcialDataFromFile = () => {
    o_ParsedStockInfoObject = readJASON(historcialDataFile) || {} ;
}
const writeHistorcialDataToFile = () => {
    writeJASON(historcialDataFile, o_ParsedStockInfoObject);
};

const getDBStockInfo = stockID => {
  return o_ParsedStockInfoObject[stockID];
};
const updateStockInfoToDB = (stockID,storeData) => {
    o_ParsedStockInfoObject[stockID] = storeData;
}

let fetchController = async (stockID, options, func) => {
    let counter = 0;
    let res = null;
    await(fectchLoop = async () => {
        try {
            res = await func(stockID, options);
            // console.log("get data"+res)
        } catch (e) {
            if (counter++ < 2) {
                console.log("fetchController fail["+counter+"]: "+ e);
                // await delay(parseInt(60 * counter * (Math.random() + 1)));
                await fectchLoop();
            } else {
                res = null;
                console.log(`fail at : ${stockID} ${e}`);
                let currentTime = moment().format("MM/DD h:mm:ss");//7/12 23:18:40
                saveData("./out/fail.txt", `${currentTime} {${stockID}} : ${e}\n`, "APPEN");
            }
        }
    })();
    // console.log("finally " +res);
    // await delay(parseInt(60 * (Math.random() + 1)));
    return res;
}

let estimate = async (stockID, options) => {
    const { DBG } = options || false;
    let forceUpdateAll = false; //強制更新 TODO:
    let forceNotToUpdateAll = true; //強制不更新 TODO:
    let s_Update_info = "";
    let calData = reset(); //清空計算的資料
    /*初始結構先看看DB有沒有在，沒有就設定空的結構*/
    let info = new stockInfo(getDBStockInfo(stockID));
    if (DBG) console.log(`=====開始抓取網路資料:${stockID}====`);
    /*獲取server資料*/
    try {
        /*計算單股各個數值*/
        if (!info.getStockName()) {
          console.log("資料不存在");
        }

        if (forceUpdateAll || forceNotToUpdateAll){
            // 每日 - 基本資料
            if (!info.getUpdatedTime("D_TIME") || info.getUpdatedTime("D_TIME")[0] !== getToday()) {
                let res = await fetchController(stockID, options, getBasicInfoWeb);
                if(res) info = mStockInfoUpdater.updateBaicInfoWeb(res, info);
                s_Update_info += "日-基本更新\n";
            }

            // 每日 - 三大法人資料
            if (!info.getUpdatedTime("D_TIME") || info.getUpdatedTime("D_TIME")[1] !== getToday()) {
                let res = await fetchController(stockID, options, getInstitutionalInvestor);
                if(res) info = mStockInfoUpdater.updateInstitutionalInvestor(res, info);
                s_Update_info += "日-三大法人更新\n";
            }

            //每日 - K線圖資料
            if (!info.getUpdatedTime("D_TIME") || info.getUpdatedTime("D_TIME")[2] !== getToday()) {
                let res = await fetchController(stockID, options, getCandlestickChart);
                if(res) info = mStockInfoUpdater.updateCandlestickChart(res, info);
                s_Update_info += "日-K線圖更新\n";
            }

            //每月 - 月營收明細
            if (getLastMonth() !== info.getUpdatedTime("M_TIME") ) {
                let res = await fetchController(stockID, options, getRevenueWeb_M);
                if(res) info = mStockInfoUpdater.updateRevenueWeb_M(res, info);
                s_Update_info += "月-月營收明細\n";
            }

            // 每季 - 獲利能力
            if (!info.getUpdatedTime("Q_TIME") || info.getUpdatedTime("Q_TIME")[0] !== info.getTempValue('Temp_Q_TIME')) {
                let res = await fetchController(stockID, options, getEarningpower);
                if(res) info = mStockInfoUpdater.updateEarningpower(res, info);
                s_Update_info += "季-獲利能力更新\n";

            }

            // 每季 - 績效更新
            if (!info.getUpdatedTime("Q_TIME") || info.getUpdatedTime("Q_TIME")[1] !== info.getTempValue('Temp_Q_TIME')) {
                let res = await fetchController(stockID, options, getPerformanceWeb_S);
                if(res) info = mStockInfoUpdater.updatePerformanceWeb_S(res, info);
                s_Update_info += "季-績效更新\n";
            }

            // 每年 - 經營績效
            lastUpdateTime = info.getUpdatedTime("Y_TIME");
            if (parseInt(getLastYear()) !== info.getUpdatedTime("Y_TIME")) {
                let res = await fetchController(stockID, options, getPerformanceWeb_Y);
                if(res) info = mStockInfoUpdater.updatePerformanceWeb_Y(res, info);
                s_Update_info += "年-經營績效\n";
            }

        }

        calData =  calculate(info);
    } catch (e) {
        console.log(`fail at : ${stockID} ${e}`);
        let currentTime = moment().format("MM/DD h:mm:ss");//7/12 23:18:40
        saveData("./out/fail.txt", `${currentTime} {${stockID}} : ${e}\n`, "APPEN");
    } finally {
        let o_WebAddress = getWebAddress(stockID); //拿到所有網址
        let showInfo = mStockInfoUpdater.getDisplay(stockID, o_WebAddress, info, calData);
        // 儲存 parserdata
        if (s_Update_info.length > 0){
            console.log(s_Update_info);
            updateStockInfoToDB(stockID, info.export());
        } else {
            console.log("沒有更新");
        }
        // 顯示資料到terminal上
        console.log(showInfo);
        // 回傳資料
        return {
            isValid: calData.isValidCompluted,
            rank: calData.rank,
            info,
            calData,
            showInfo
        }
    }
};

module.exports.evaluate = async (stockID, options) => {
    let res ;
    let showInfo;
    // 讀取歷史資料
    readHistorcialDataFromFile();
    // 計算
    if (stockID){
        console.log(`single stock - ${stockID}`);
        res = await estimate(stockID, options);
        showInfo = res.showInfo;
    } else {
        console.log(`query all stock`);
        // 抓取所有股票
        let a_AllStock = await getStockIDList(options);
        const funcs = a_AllStock.map(
            tempStockID => async () => {
                let res = await estimate(tempStockID, options);
                return Promise.resolve(res);

        });
        res = (await promiseSerial(funcs))
        showInfo = res
          .filter(val => val.isValid)
          .sort((a, b) => b.rank - a.rank)
          .reduce((acc, cur, i) => acc + `RANK: ${i+1}\n`+cur.showInfo, "");
    }

    //儲存要回來的資料
    writeHistorcialDataToFile();
    //儲存計算後的資料
    fileName = `${dateNow}-${stockID || 'all'}.txt`;
	//儲存資料到DB
    storeStockInfo(fileName, showInfo, options.save)
}

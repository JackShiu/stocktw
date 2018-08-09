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
    getPerformanceWeb_Y
} = require("../parser/jsjustweb.jihsun.com.tw/main");
const { getTWStockList, getStockIDList } = require("../parser/isin.twse.com.tw/main");
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

let getDisplay = (stockID = "NULL", o_WebAddress = {}, info ={}, cal = {}) =>
`=======[${stockID}]========
股票：${info.getStockName()}
營收比重：${info.getProductType()}
基本資料網站: ${o_WebAddress.BasicInfoWeb}
收盤價: ${info.getPrice('D_closingPrice')} (元)
預估本益比: ${cal.PredictPE[0].toFixed(2)}~${cal.PredictPE[1].toFixed(2)}
過去本益比區間(年): 高:[${info.getPE("Y_max").slice(0,6)}] 低:[${info.getPE("Y_min").slice(0,6)}]
預估營收年增率: ${cal.predictProfitMonthYoY.toFixed(2)} (%)
  (過去六個月 [${info.getOperatingRevenue('M_YoY').slice(0, 5)}])
預估營收: ${cal.PredictedEarning.toFixed(2)} (百萬)
預估稅後淨利率: ${(cal.PredictProfitRatio*100).toFixed(2)} (%)
預估EPS: ${cal.PredictEPS.toFixed(2)} (元) (過去兩年PES=[${info.getEPS('Y_value').slice(0,2)}])
預估股價高低落點: ${cal.PredictHighestPrice.toFixed(2)}~${cal.PredictLowestPrice.toFixed(2)} ,(當前:${info.getPrice('D_closingPrice')})
預估報酬率: ${cal.PredictEarningRatio.toFixed(2)}
預估風險: ${cal.PredictLossRatio.toFixed(2)}
風險報酬倍數: ${cal.RiskEarningRatio.toFixed(2)}
PEG : ${cal.PEG.toFixed(3)}\n
`;

let estimate = async (stockID, options) => {
    const { DBG } = options || false;
    let lastUpdateTime = null;
    let forceUpdateAll = false; //強制更新 TODO:
    let forceNotToUpdateAll = false; //強制不更新 TODO:
    let is_D_Update = false;
    let is_M_Update = false;
    let is_Q_Update = false;
    let is_Y_Update = false;
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
        // 抓取基本資料
        if (forceUpdateAll || !forceNotToUpdateAll){
            let res = await getBasicInfoWeb(stockID, options);
            await delay(parseInt(30 * Math.random()));
            info.setStockName(res.s_stockName);
            info.setProductType(res.s_ProductType);
            info.setPrice("D_closingPrice", res.s_closingPrice);
            info.setPE("D_current", res.s_current_PE);
            info.setPE("Y_max", res.a_H_PER);
            info.setPE("Y_min", res.a_L_PER);
            info.setPE("Y_TIME", res.Y_TIME);
            is_D_Update = true;
        }

        // 每月
        lastUpdateTime = info.getUpdatedTime("M_TIME"); //2018.07
        if ((getLastMonth() !== lastUpdateTime || forceUpdateAll) && !forceNotToUpdateAll) {
            let res = await getRevenueWeb_M(stockID, options);
            await delay(parseInt(30 * Math.random()));
            info.setOperatingRevenue("M_value", res.a_OperatingRevenue_M);
            info.setOperatingRevenue("M_YoY", res.a_OperatingRevenue_M_YoY);
            info.setOperatingRevenue("M_TIME", res.M_TIME);
            // update last updating date
            info.setUpdatedTime("M_TIME", res.M_TIME[0]);
            is_M_Update = true;
        }

        // 每季
        lastUpdateTime = info.getUpdatedTime("Q_TIME"); //2018.1Q
        if ((getLastQuarter() !== lastUpdateTime || forceUpdateAll) && !forceNotToUpdateAll){
            let res = await getPerformanceWeb_S(stockID, options);
            await delay(parseInt(30 * Math.random()));
            info.setOperatingRevenue("Q_value", res.a_OperatingRevenue_Q);
            info.setOperatingRevenue("Q_TIME", res.a_Q_TIME);
            info.setNetIncome("Q_afterTax", res.a_NetIncome_Q_afterTax);
            info.setNetIncome("Q_beforeTax", res.a_NetIncome_Q_beforTax);
            info.setNetIncome("Q_TIME", res.a_Q_TIME);
            info.setEPS("Q_value", res.a_EPS_Q);
            info.setEPS("Q_TIME", res.a_Q_TIME);
            info.setCapital("Q_value", res.a_Capital_Q);
            info.setCapital("Q_TIME", res.a_Q_TIME);
            // update last updating date
            info.setUpdatedTime("Q_TIME", res.Q_TIME[0]);
            is_Q_Update = true;
        }

        // 每年
        lastUpdateTime = info.getUpdatedTime("Y_TIME");
        if ((parseInt(getLastYear()) !== lastUpdateTime || forceUpdateAll) && !forceNotToUpdateAll) {
            let res = await getPerformanceWeb_Y(stockID, options);
            await delay(parseInt(60 * Math.random()))
            info.setOperatingRevenue("Y_value", res.a_OperatingRevenue_Y);
            info.setOperatingRevenue("Y_TIME", res.Y_TIME);
            info.setEPS("Y_value", res.a_EPS_Y);
            info.setEPS("Y_TIME", res.Y_TIME);
            // update last updating date
            info.setUpdatedTime("Y_TIME", res.Y_TIME[0]);
            is_Y_Update = true;
        }
        calData =  calculate(info);
    } catch (e) {
        console.log(`fail at : ${stockID} ${e}`);
        let currentTime = moment().format("MM/DD h:mm:ss");//7/12 23:18:40
        saveData("./out/fail.txt", `${currentTime} {${stockID}} : ${e}\n`, "APPEN");
    } finally {
        if(is_D_Update) console.log("基本更新")
        if(is_M_Update) console.log("月資料更新")
        if(is_Q_Update) console.log("季資料更新")
        if(is_Y_Update) console.log("年更新")
        // 顯示資料到terminal上
        let o_WebAddress = getWebAddress(stockID);//拿到所有網址
        let showInfo = getDisplay(stockID, o_WebAddress, info, calData);
        console.log(showInfo)
        // 儲存 parserdata
        if (is_D_Update | is_M_Update | is_Q_Update | is_Y_Update)
            updateStockInfoToDB(stockID, info.export());
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
        console.log(`query single stock ${stockID}`);
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

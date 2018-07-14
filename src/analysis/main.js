let delay = require("await-delay");
let moment =require("moment");
const { storeStockInfo } = require("../fs/fs");

const { calculate_v1, emptyReturn } = require("./calculate");
const {
    getWebAddress,
    getBasicInfoWeb,
    getRevenueWeb_M,
    getPerformanceWeb_S,
    getPerformanceWeb_Y
} = require("../parser/jsjustweb.jihsun.com.tw/main");
const { getTWStockList } = require("../parser/isin.twse.com.tw/main");
const { saveData, readJASON, writeJASON } = require("../fs/fs");

/* promise 序列化函數 */
const promiseSerial = funcs =>
    funcs.reduce((promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]));

// /*評估方式一： 計算單一類股*/
// module.exports.evaluate = evaluate = async (stockID, options) => {
//     const { DBG } = options || false;
//     if (DBG) console.log(`=====開始抓取網路資料:${stockID}====`)
//     /*獲取server資料*/
//     const data = await getStockData(stockID, options);
//     /*計算單股各個數值*/
//     return calculate(data, options);
// };

// /*評估方式二： 計算所以類股*/
// module.exports.calculateAll = async (stockID, options) => {
//     console.log("計算全部");
//     let storeString = {};
//     // 抓取所有股票
//     let data = await getTWStockList(options);

//     // 遍例抓取的股票陣列
//     /* 定義每個promise處理函數*/
//     const funcs = data.map(
//         stock => async () => {
//             try {
//                 let value = await evaluate(stock, options);
//                 /*除非要求存檔全部，不然只存有效資料*/
//                 if (options.allData | value.valid) {
//                     return Promise.resolve({ data: value.data, riskEarningRatio: value.riskEarningRatio })
//                 }
//                 //設定延遲時間
//                 await delay(parseInt(200 * Math.random()))
//             } catch (e) {
//                 console.log(`fail at : ${stock}`);
//                 let date = new Date();
//                 let currentTime = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
//                 saveData("./out/fail.txt", `${currentTime} {${stock}} : ${e}\n`, "APPEN");
//             }
//             return Promise.resolve({ data: false, riskEarningRatio: -1 })

//         })
//     /*濾出有效資料，並且排序*/
//     let reqData = (await promiseSerial(funcs))
//         .filter(val => val.data != false)
//         .sort((a, b) => b.riskEarningRatio - a.riskEarningRatio);
//     /*物件串接*/
//     storeString.data = reqData.map(val => val.data).reduce((acc, val) => acc.concat(val));
//     // console.log(storeString.data);
//     return storeString
// }

// 用來暫存 所有stock 的歷史資料
let o_historcialData = {};
const historcialDataFile = "src/data/all_stock_value.jason";
const currentTime = moment().format("MMMM Do YYYY, h:mm:ss a");

const readHistorcialData = () => {
    o_historcialData = readJASON(historcialDataFile) || {} ;
}
const saveHistorcialData = () => {
    writeJASON(historcialDataFile, o_historcialData);
};

const updateHistoricalData = (stockID, data) =>{

}

let getEmptystockInfo = () => ({
    s_Name: null,
    s_ProductType: null,
    o_Price: {
        s_closingPrice: null,
        s_maxInYear: null,
        s_minInYear: null
    },
    o_Capital: {
        o_Quarterly: {
            a_season: [],
            a_value: []
        }
    },
    o_PE: {
        s_current: null,
        s_peerToEarth_ratio :null,
        o_Yearly: {
            a_year: [],
            a_max: [],
            a_min: []
        }
    },
    o_EPS: {
        o_Quarterly: {
            a_season: [],
            a_afterTax: [],
            a_beforeTax: [],
        },
        o_Yearly: {
            a_year: [],
            a_value: []
        },
        s_YoY: null
    },
    o_OperatingRevenue: {
        o_Monthly: {
            a_month: [],
            a_value: [],
            a_MoM: [],
            a_YoY: []
        },
        o_Quarterly: {
            a_season: [],
            a_value: []
        },
        o_Yearly: {
            a_year: [],
            a_value: []
        }
    },
    a_OperatingCost: [],
    a_OperatingIncome: [],
    a_OperatingExpend: [],
    o_NetIncome: {
        o_Quarterly: {
            a_season: [],
            a_afterTax: [],
            a_beforeTax: []
        },
        o_Yearly: {
            a_year: [],
            a_afterTax: [],
            a_beforeTax: []
        }
    }
});

let getDisplayString = (stockID = "NULL", o_WebAddress = {}, pureData ={}, calData = {}) => `
=======[${stockID}]========
股票：${pureData.s_Name}
營收比重：${pureData.s_ProductType}
基本資料網站: ${o_WebAddress.BasicInfoWeb}
收盤價: ${pureData.o_Price.s_closingPrice} (元)
預估本益比: ${calData.PredictPE[0].toFixed(2)}~${calData.PredictPE[1].toFixed(2)}
過去本益比區間(年): 高:[${pureData.o_PE.o_Yearly.a_max}] 低:[${pureData.o_PE.o_Yearly.a_min}]
預估營收年增率: ${calData.predictProfitMonthYoY.toFixed(2)} (%)
  (過去六個月 [${pureData.o_OperatingRevenue.o_Monthly.a_YoY}])
預估營收: ${calData.PredictedEarning.toFixed(2)} (百萬)
預估稅後淨利率: ${(calData.PredictProfitRatio*100).toFixed(2)} (%)
預估EPS: ${calData.PredictEPS.toFixed(2)} (元) (過去兩年PES=[${pureData.o_EPS.o_Yearly.a_value.slice(0,2)}])
預估股價高低落點: ${calData.PredictHighestPrice.toFixed(2)}~${calData.PredictLowestPrice.toFixed(2)} ,(當前:${pureData.o_Price.s_closingPrice})
預估報酬率: ${calData.PredictEarningRatio.toFixed(2)}
預估風險: ${calData.PredictLossRatio.toFixed(2)}
風險報酬倍數: ${calData.RiskEarningRatio.toFixed(2)}
PEG : ${calData.PEG.toFixed(3)}
`;

let estimate = async (stockID, options) => {
    const { DBG } = options || false;
    let o_WebAddress = await getWebAddress(stockID);
    let o_currentData = getEmptystockInfo();
    let calData = emptyReturn();
    if (DBG) console.log(`=====開始抓取網路資料:${stockID}====`);
    /*獲取server資料*/
    try {
        /*計算單股各個數值*/
        let b_isDataExist = false;
        if (o_historcialData[stockID]) b_isDataExist = true;
        // console.log(currentTime);

        // 抓取基本資料 (s_closingPrice ,s_maxInYear,s_minInYear )
        let o_BasicInfo = await getBasicInfoWeb(stockID, options);
        o_currentData.s_Name = o_BasicInfo.stockName;
        o_currentData.s_ProductType = o_BasicInfo.ProductType;
        o_currentData.o_Price.s_closingPrice = o_BasicInfo.currentStockValue;
        o_currentData.o_PE.s_current = o_BasicInfo.currentPERValue ;
        o_currentData.o_PE.o_Yearly.a_year = o_BasicInfo.PER_YEAR;
        o_currentData.o_PE.o_Yearly.a_max = o_BasicInfo.H_PER;
        o_currentData.o_PE.o_Yearly.a_min = o_BasicInfo.L_PER;

        // 每月
        let o_RevenueWeb_M = await getRevenueWeb_M(stockID, options);
        o_currentData.o_OperatingRevenue.o_Monthly.a_month = o_RevenueWeb_M.profitMonthYoY.month;
        o_currentData.o_OperatingRevenue.o_Monthly.a_value = o_RevenueWeb_M.profitMonthValue;
        o_currentData.o_OperatingRevenue.o_Monthly.a_YoY = o_RevenueWeb_M.profitMonthYoY.value;

        // 每季
        let o_PerformanceWeb_S = await getPerformanceWeb_S(stockID, options);
        o_currentData.o_OperatingRevenue.o_Quarterly.a_value = o_PerformanceWeb_S.OperatingRevenueQuarterly;
        o_currentData.o_NetIncome.o_Quarterly.a_afterTax = o_PerformanceWeb_S.NetProfit_afterTax;
        o_currentData.o_NetIncome.o_Quarterly.a_beforeTax = o_PerformanceWeb_S.NetProfit_beforTax;
        o_currentData.o_EPS.o_Quarterly.a_afterTax = o_PerformanceWeb_S.NetProfit_afterTax;
        o_currentData.o_EPS.o_Quarterly.a_beforeTax = o_PerformanceWeb_S.EPS_beforeTax;
        o_currentData.o_Capital.o_Quarterly.a_value = o_PerformanceWeb_S.Capital;
        o_currentData.o_NetIncome.o_Quarterly.a_season = o_PerformanceWeb_S.Quarter;
        o_currentData.o_EPS.o_Quarterly.a_season = o_PerformanceWeb_S.Quarter;
        o_currentData.o_Capital.o_Quarterly.a_season = o_PerformanceWeb_S.Quarter;

        // 每年
        let o_PerformanceWeb_Y = await getPerformanceWeb_Y(stockID, options);
        o_currentData.o_OperatingRevenue.o_Yearly.a_value = o_PerformanceWeb_Y.YearEarning_Y;
        o_currentData.o_EPS.o_Yearly.a_value = o_PerformanceWeb_Y.EPSYear;
        o_currentData.o_OperatingRevenue.o_Yearly.a_year = o_PerformanceWeb_Y.Year;
        o_currentData.o_EPS.o_Yearly.a_year = o_PerformanceWeb_Y.Year;

        calData =  calculate_v1(o_currentData);
    } catch (e) {
        console.log(`fail at : ${stockID}`);
        let date = new Date();
        let currentTime = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        saveData("./out/fail.txt", `${currentTime} {${stockID}} : ${e}\n`, "APPEN");
    } finally {
        // print data in here - calData
        let printString = getDisplayString(stockID, o_WebAddress, o_currentData, calData);
        console.log(printString)
        // 回傳資料
        return {
            isValid: calData.isValidCompluted,
            rank: calData.rank,
            pureData:o_currentData,
            calData,
            printString
        }
    }
};

module.exports.evaluate_v2 = async (stockID, options) => {
    let resData ;
    let printString;
    // 讀取歷史資料
    readHistorcialData();
    // 計算
    if (stockID){
        console.log(`query single stock ${stockID}`);
        resData = await estimate(stockID, options);
        printString = resData.printString;
    } else {
        console.log(`query all stock`);
        // 抓取所有股票
        let a_AllStock = await getTWStockList(options);
        const funcs = a_AllStock.map(
            tempStockID => async () => {
                let res = await estimate(tempStockID, options);
                //設定延遲時間
                await delay(parseInt(200 * Math.random()))
                return Promise.resolve(res);

        });
        resData = (await promiseSerial(funcs))
        printString = resData
          .filter(val => val.isValid)
          .sort((a, b) => b.rank - a.rank)
          .reduce((acc, cur) => acc + cur.printString, "");
    }

    //儲存要回來的資料
    //儲存計算後的資料
    let date = new Date()
    let timeformat = (val) => ('0' + val).substr(-2); //自動補零
    let dateNow = `${date.getFullYear()}-${timeformat(date.getMonth() + 1)}-${timeformat(date.getDate())}`;
    let fileName = `${dateNow}-all.txt`
    if (stockID != undefined)
        fileName = `${dateNow}-${stockID}.txt`;

    storeStockInfo(fileName, printString, options.save)
}


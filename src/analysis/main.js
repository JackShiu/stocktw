let delay = require("await-delay");
let moment =require("moment");
const { storeStockInfo } = require("../fs/fs");
const { parseValue } = require("../parser/util/util");

const { calculate_v1, emptyReturn } = require("./calculate");
const {
    getWebAddress,
    getBasicInfoWeb,
    getRevenueWeb_M,
    getPerformanceWeb_S,
    getPerformanceWeb_Y
} = require("../parser/jsjustweb.jihsun.com.tw/main");
const { getTWStockList, getStockIDList } = require("../parser/isin.twse.com.tw/main");
const { saveData, readJASON, writeJASON } = require("../fs/fs");

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
      .subtract(2, "month") //往前在推2個月
      .format("YYYY.Q[Q]");//2018.2Q

}

const historcialDataFile = "src/data/all_stock_value.jason";
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

let getEmptystockInfo = () => ({
    s_Name: null,
    s_ProductType: null,
    o_UpdateTime: {
        s_month: null, //2018-08
        s_quarter: null, //2018-Q1
        s_year: null //2018
    },
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

let getDisplayString = (stockID = "NULL", o_WebAddress = {}, pureData ={}, calData = {}) =>
`=======[${stockID}]========
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
PEG : ${calData.PEG.toFixed(3)}\n
`;

let estimate = async (stockID, options) => {
    const { DBG } = options || false;
    let dataUpdate =false;
    let lastUpdateTime = null;
    let forceUpdateAll = false; //強制更新 TODO:
    let forceNotToUpdateAll = false; //強制不更新 TODO:
    let isBasicUpdated = false;
    let isMonthlyUpdated = false;
    let isQuarterlyUpdated = false;
    let isYearlyUpdated = false;
    let o_WebAddress = await getWebAddress(stockID);
    /*初始結構先看看DB有沒有在，沒有就設定空的結構*/
    let o_currentData = getDBStockInfo(stockID) || getEmptystockInfo();
    let calData = emptyReturn();
    if (DBG) console.log(`=====開始抓取網路資料:${stockID}====`);
    /*獲取server資料*/
    try {
        /*計算單股各個數值*/
        if (!o_currentData.s_Name){
            console.log("資料不存在")
        }
        // 抓取基本資料
        if (forceUpdateAll || !forceNotToUpdateAll){
            let o_BasicInfo = await getBasicInfoWeb(stockID, options);
            await delay(parseInt(60 * Math.random()));
            o_currentData.s_Name = o_BasicInfo.stockName;
            o_currentData.s_ProductType = o_BasicInfo.ProductType;
            o_currentData.o_Price.s_closingPrice = o_BasicInfo.currentStockValue;
            o_currentData.o_PE.s_current = o_BasicInfo.currentPERValue ;
            o_currentData.o_PE.o_Yearly.a_year = o_BasicInfo.PER_YEAR;
            o_currentData.o_PE.o_Yearly.a_max = o_BasicInfo.H_PER;
            o_currentData.o_PE.o_Yearly.a_min = o_BasicInfo.L_PER;
            isBasicUpdated = true;
        }

        // 每月
        lastUpdateTime = o_currentData.o_UpdateTime.s_month; //2018.07
        if ((getLastMonth() !== lastUpdateTime || forceUpdateAll) && !forceNotToUpdateAll) {
            let o_RevenueWeb_M = await getRevenueWeb_M(stockID, options);
            await delay(parseInt(60 * Math.random()));
            o_currentData.o_OperatingRevenue.o_Monthly.a_month = o_RevenueWeb_M.month;
            o_currentData.o_OperatingRevenue.o_Monthly.a_value = o_RevenueWeb_M.profitMonthValue;
            o_currentData.o_OperatingRevenue.o_Monthly.a_YoY = o_RevenueWeb_M.profitMonthYoY;
            // update last updating date
            o_currentData.o_UpdateTime.s_month = o_RevenueWeb_M.month[0];
            isMonthlyUpdated = true;
        }

        // 每季
        lastUpdateTime = o_currentData.o_UpdateTime.s_quarter; //2018.1Q
        if ((getLastQuarter() !== lastUpdateTime || forceUpdateAll) && !forceNotToUpdateAll){
            let o_PerformanceWeb_S = await getPerformanceWeb_S(stockID, options);
            await delay(parseInt(60 * Math.random()));
            o_currentData.o_OperatingRevenue.o_Quarterly.a_value = o_PerformanceWeb_S.OperatingRevenueQuarterly;
            o_currentData.o_NetIncome.o_Quarterly.a_afterTax = o_PerformanceWeb_S.NetProfit_afterTax;
            o_currentData.o_NetIncome.o_Quarterly.a_beforeTax = o_PerformanceWeb_S.NetProfit_beforTax;
            o_currentData.o_EPS.o_Quarterly.a_afterTax = o_PerformanceWeb_S.NetProfit_afterTax;
            o_currentData.o_EPS.o_Quarterly.a_beforeTax = o_PerformanceWeb_S.EPS_beforeTax;
            o_currentData.o_Capital.o_Quarterly.a_value = o_PerformanceWeb_S.Capital;
            o_currentData.o_NetIncome.o_Quarterly.a_season = o_PerformanceWeb_S.Quarter;
            o_currentData.o_EPS.o_Quarterly.a_season = o_PerformanceWeb_S.Quarter;
            o_currentData.o_Capital.o_Quarterly.a_season = o_PerformanceWeb_S.Quarter;
            // update last updating date
            o_currentData.o_UpdateTime.s_quarter = o_PerformanceWeb_S.Quarter[0];
            isQuarterlyUpdated = true;
        }

        // 每年
        lastUpdateTime = o_currentData.o_UpdateTime.s_year;
        if ((parseInt(getLastYear()) !== lastUpdateTime || forceUpdateAll) && !forceNotToUpdateAll) {
            let o_PerformanceWeb_Y = await getPerformanceWeb_Y(stockID, options);
            await delay(parseInt(60 * Math.random()))
            o_currentData.o_OperatingRevenue.o_Yearly.a_value = o_PerformanceWeb_Y.YearEarning_Y;
            o_currentData.o_EPS.o_Yearly.a_value = o_PerformanceWeb_Y.EPSYear;
            o_currentData.o_OperatingRevenue.o_Yearly.a_year = o_PerformanceWeb_Y.Year;
            o_currentData.o_EPS.o_Yearly.a_year = o_PerformanceWeb_Y.Year;
            // update last updating date
            o_currentData.o_UpdateTime.s_year = o_PerformanceWeb_Y.Year[0];
            isYearlyUpdated = true;
        }
        calData =  calculate_v1(o_currentData);
    } catch (e) {
        console.log(`fail at : ${stockID} ${e}`);
        let currentTime = moment().format("MM/DD h:mm:ss");//7/12 23:18:40
        saveData("./out/fail.txt", `${currentTime} {${stockID}} : ${e}\n`, "APPEN");
    } finally {
        // print data in here - calData
        let printString = getDisplayString(stockID, o_WebAddress, o_currentData, calData);
        if(isBasicUpdated) console.log("基本更新")
        if(isMonthlyUpdated) console.log("月資料更新")
        if(isQuarterlyUpdated) console.log("季資料更新")
        if(isYearlyUpdated) console.log("年更新")
        // 顯示資料到terminal上
        console.log(printString)
        // 儲存 parserdata
		dataUpdate = isBasicUpdated | isMonthlyUpdated | isQuarterlyUpdated |isYearlyUpdated
        if(dataUpdate)
            updateStockInfoToDB(stockID, o_currentData)
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

module.exports.evaluate = async (stockID, options) => {
    let resData ;
    let printString;
    // 讀取歷史資料
    readHistorcialDataFromFile();
    // 計算
    if (stockID){
        console.log(`query single stock ${stockID}`);
        resData = await estimate(stockID, options);
        printString = resData.printString;
    } else {
        console.log(`query all stock`);
        // 抓取所有股票
        let a_AllStock = await getStockIDList(options);
        const funcs = a_AllStock.map(
            tempStockID => async () => {
                let res = await estimate(tempStockID, options);
                return Promise.resolve(res);

        });
        resData = (await promiseSerial(funcs))
        printString = resData
          .filter(val => val.isValid)
          .sort((a, b) => b.rank - a.rank)
          .reduce((acc, cur, i) => acc + `RANK: ${i+1}\n`+cur.printString, "");
    }

    //儲存要回來的資料
    writeHistorcialDataToFile();
    //儲存計算後的資料
    fileName = `${dateNow}-${stockID || 'all'}.txt`;
	//儲存資料到DB
    storeStockInfo(fileName, printString, options.save)
}



//calculate value
let predictProfitMonthYoY = -1;
let PredictedEarning = -1;
let PredictProfitRatio = -1;
let PredictEPS = -1;
let PredictPE = [];
let EPSYoY;
let PEG;
let RiskEarningRatio = -1;

// other value
let isValidOfPEAverage;
let isValidOfpredictProfitMonthYoY;
let isValidCompluted = false;
let displayString = [];

const log = (val, hide) => {
    displayString.push(val + "\n");
    if (!hide)
        console.log(val);
}


/*最高本益比
  最低本益比
  預估本益比區間*/
const getPEAverage = (data, limit) => {
    let firstValue = -1;
    let MaxPE;
    let MinPE;
    let PEList = [];
    let threshold = 2;

    //要有六比資料才開始計算，雖然這個因該不會跑到
    // if(data.length <5) {
    // 	isValidOfPEAverage=false;
    // 	return -1;
    // }

    data.map((val, i) => {
        // console.log(i,val)	
        //有負值，就不繼續計算
        if (val < 0 || !isValidOfPEAverage) {
            isValidOfPEAverage = false;
            return false;
        }

        if (firstValue == -1) {
            firstValue = MaxPE = MinPE = val;
            PEList.push(val)
        } else {
            switch (limit) {
                case "MAX": //最大值要找最小邊界
                    if (val < (MinPE * threshold) && val > (MinPE / threshold)) {
                        PEList.push(val);
                        if (val < MinPE)
                            MinPE = val
                    }
                    break;
                case "MIN"://最小值要找最大邊界
                    if (val < (MaxPE * threshold) && val > (MaxPE / threshold)) {
                        PEList.push(val);
                        if (val > MaxPE)
                            MaxPE = val
                    }
                    break;
            }
        }
    });
    // console.log(MaxPE, MinPE, PEList);

    //如果已經無效，就沒有在繼續計算下去的意義
    if (!isValidOfPEAverage) return -1;

    //計算基本平均數
    const avgPE = PEList.reduce((acc, val) => { return acc + val }) / PEList.length;
    // console.log("基本平均數",avgPE.toFixed(2));

    //計算標準差
    const sumDiff = PEList.reduce((acc, val) => {
        return acc + Math.pow(val - avgPE, 2);
    });
    const delta = Math.pow(sumDiff / PEList.length, 0.5);
    // console.log("標準差", delta.toFixed(2),sumDiff.toFixed(2));

    //挑選兩倍標準差內的數值
    const newList = PEList.filter(val => {
        return (val <= avgPE + 2 * delta)
            && (val >= avgPE - 2 * delta)
    });
    // console.log("兩倍標準差內的數值",newList);

    //計算常態分佈平均值
    return newList.reduce((acc, val) => acc + val) / newList.length
}

/* ===== Calculate ==== */
module.exports.calculate = (data) => {
    //存取資料
    const {
        /* web 1 基本資料 */
        BasicInfoWeb, //基本資料 網址
        stockID, //股票名稱
        currentStartStockValue,// 開盤價 (int)
        currentStockValue,// 收盤價 (int)
        currentPERValue,// 當前本益比 (int)
        H_PER,//最高本益比 (array)(6 years)
        L_PER,//最低本益比 (array)(6 years)
        stockName,//股票名稱 (string)
        ProductType,//營收比重 (string)

        /* web 2 營收明細(月) */
        RevenueWeb_M, // 營收明細 (月) 網址
        profitMonthYoY,//月營收年增率(array) (6 month)

        /* web 3 經營績效(季) */
        PerformanceWeb_S,//經營績效(季) 網址
        OperatingRevenueMonth,//營業收入 (array) (4 season)
        NetProfit,//稅後淨利 (array) (4 season)
        Capital,// 加權平均股數 (int) (last season) <- TODO: this may not be true

        /* web 4 經營績效(年) */
        PerformanceWeb_Y,//經營績效(年) 網址
        YearEarningLastY,//(去年)營業收入 (int)
        EPSYear,//稅後每股盈餘 (array) (過去兩年)
        /* other options */
        DBG
    } = data;

    if (DBG) console.log(`=======開始計算========`)
    if (!DBG) log(`=======[${stockID}]========`, DBG)
    log(`股票：${stockName}`);
    log(`營收比重：${ProductType}`);
    log(`基本資料網站: ${BasicInfoWeb}`);
    log(`收盤價: ${currentStockValue}`);

	/*最高本益比
	  最低本益比
	  預估本益比區間*/
    isValidOfPEAverage = true;
    const AvgMaxPE = getPEAverage(H_PER, "MAX");
    const AvgMinPE = getPEAverage(L_PER, "MIN");
    if (isValidOfPEAverage) {
        // console.log(AvgMaxPE,AvgMinPE);
        //平均值要跟最新得數值比大小，都取最小值
        PredictPE = [Math.min(AvgMaxPE, H_PER[0])
            , Math.min(AvgMinPE, L_PER[0])];
        log(`預估本益比: ${PredictPE[0].toFixed(2)}~${PredictPE[1].toFixed(2)}`);
        log(`過去本益比區間(年): 高:[${H_PER}] 低:[${L_PER}] `);
    } else {
        log(`預估本益比(失敗): [${H_PER}] [${L_PER}] `);
    }

	/*預估營收年增率
	  條件：
		1.近6個月營收年增率不能有負值
		2."最新的月營收年增率"與這"六個月的平均"，取出最小值當作預估營收年增率
	*/
    isValidOfpredictProfitMonthYoY = true;
    let sumOFprofitMonthYoY = profitMonthYoY.reduce((acc, cur) => {
        if (cur < 0) isValidOfpredictProfitMonthYoY = false;
        return acc + cur
    });
    if (isValidOfpredictProfitMonthYoY) {
        let averageOFprofitMonthYoY = (sumOFprofitMonthYoY / 6);
        if (DBG) console.log("平均營收年增率: " + averageOFprofitMonthYoY.toFixed(2));
        if (DBG) console.log("最新收年增率: " + profitMonthYoY[0].toFixed(2));
        predictProfitMonthYoY = profitMonthYoY[0] < averageOFprofitMonthYoY ? profitMonthYoY[0] : averageOFprofitMonthYoY;
        log("預估營收年增率: " + predictProfitMonthYoY.toFixed(2));
    } else {
        log("預估營收年增率(有負值,空值): (近六個月年營收)" + profitMonthYoY);
    }

	/*預估營收
	  算法： 去年營收*(1+預估營收年增率/100 )
	*/
    if (isValidOfpredictProfitMonthYoY) {
        PredictedEarning = (YearEarningLastY * (1 + predictProfitMonthYoY / 100));
        log("預估營收: " + PredictedEarning.toFixed(2));
    } else {
        log(`無法預估營收: LastYearEarning ${YearEarningLastY}`);
    }

	/*預估稅後淨利率
	  算法: 過去4個月(稅後淨利/營業收入)的平均
	*/
    let isValidOfPredictProfitRatio = true
    let sumOFProfitRatio = NetProfit.reduce((acc, cur, i) => {
        let OR_M = OperatingRevenueMonth[i];
        if (cur < 0 || OR_M < 0) isValidOfPredictProfitRatio = false;
        // console.log(acc,cur,OR_M,cur/OR_M,i);
        return acc + cur / OR_M;
    }, 0)
    if (isValidOfPredictProfitRatio) {
        PredictProfitRatio = (sumOFProfitRatio / 4);
        log("預估稅後淨利率: " + PredictProfitRatio.toFixed(4));
    } else {
        log(`預估稅後淨利率無法預測: sumOFProfitRatio ${sumOFProfitRatio.toFixed(2)} `);
    }

    if (isValidOfPEAverage
        && isValidOfpredictProfitMonthYoY
        && isValidOfPredictProfitRatio
        && Capital
    ) {
        /*預估EPS
           算法: (預測營收 * 預估稅後淨後率 * 100)÷股本×10
                  =(過去的營收×預估的營收年增率×預估稅後淨後率)÷股本×10
           */
        PredictEPS = (PredictedEarning * PredictProfitRatio * 100 / Capital * 10).toFixed(3);
        log("預估EPS: " + PredictEPS);

        /*預估股價高低落點*/
        let PredictHighestPrice = PredictEPS * PredictPE[0];
        let PredictLowestPrice = PredictEPS * PredictPE[1];
        log(`預估股價高低落點: ${PredictHighestPrice.toFixed(2)}~${PredictLowestPrice.toFixed(2)} ,(當前:${currentStockValue})`);

        /*預估報酬率*/
        let PredictEarningRatio = (PredictHighestPrice - currentStockValue) / currentStockValue;
        log(`預估報酬率: ${PredictEarningRatio.toFixed(2)}`);

        /*預估風險*/
        let PredictLossRatio = (currentStockValue - PredictLowestPrice) / currentStockValue;
        log(`預估風險: ${PredictLossRatio.toFixed(2)}`);

        /*風險報酬倍數*/
        if (PredictLossRatio < 0) {
            //小於0表示沒風險，所以以一個很小的非零數值取代
            RiskEarningRatio = Math.abs(PredictEarningRatio / 0.0001);
        } else {
            RiskEarningRatio = Math.abs(PredictEarningRatio / PredictLossRatio);
        }

        log(`風險報酬倍數: ${RiskEarningRatio.toFixed(2)}`);

        /*計算過去兩年EPS的年增率
             算法： 去年/前年 -1
           */
        EPSYoY = EPSYear[0] / EPSYear[1] - 1;

        /*計算PEG
             算法： 本益比 / EPS年增率
             概念：EPS=稅後淨利除以股本乘以10，納入了股本因素
                  畢竟股本如果膨脹會有稀釋效果，用EPS成長率更能代表公司的獲利成長情況。
             判斷：台股PEG能降到0.4以下才稱得上具有股價低估的投資價值
           */
        PEG = currentStockValue / PredictEPS / EPSYoY / 100;
        log(`PEG : ${PEG.toFixed(2)}`);

        isValidCompluted = true;
    } else {
        /*數值不正確，無法進行計算*/
        log("(有)數值不正確，無法進行計算 !!!");
    }
    log("\n");
    return {
        valid: isValidCompluted,
        data: displayString,
        riskEarningRatio: RiskEarningRatio
    };
}

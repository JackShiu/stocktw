
//calculate value
let predictProfitMonthYoY = -1;
let PredictedEarning = -1;
let PredictProfitRatio = -1;
let PredictEPS = -1;
let PredictPE = [];
let EPSYoY;
let PredictHighestPrice;
let PredictLowestPrice;
let PredictEarningRatio;
let PredictLossRatio;
let RiskEarningRatio = -1;
let PEG;

// other value
let isValidOfPEAverage;
let isValidOfpredictProfitMonthYoY;
let isValidOfPredictProfitRatio;
let isValidCompluted = false;
let rank = -1;

// let displayString = [];

const log = (val, hide) => {
    displayString.push(val + "\n");
    if (!hide)
        console.log(val);
}


/*計算本益比(PE)常態分佈平均值*/
const getPEAverage = (data =[], limit) => {
    let firstValue = -1;
    let MaxPE;
    let MinPE;
    let PEList = [];
    let threshold = 2;
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



module.exports.reset = clearAll = () => {
    isValidOfPEAverage = false ;
    isValidOfpredictProfitMonthYoY = false ;
    isValidOfPredictProfitRatio = false ;
    predictProfitMonthYoY = -1;
    PredictedEarning = -1;
    PredictProfitRatio = -1;
    PredictEPS = -1;
    PredictPE = [-1, -1];
    EPSYoY = -1;
    PredictHighestPrice = -1;
    PredictLowestPrice = -1;
    PredictEarningRatio = -1;
    PredictLossRatio = -1;
    RiskEarningRatio = -1;
    PEG = -1;
    isValidCompluted = false;
    rank = 0;

    return {
        isValidOfPEAverage,
        PredictPE,
        isValidOfpredictProfitMonthYoY,
        predictProfitMonthYoY,
        PredictedEarning,
        isValidOfPredictProfitRatio,
        PredictProfitRatio,
        PredictEPS,
        PredictHighestPrice,
        PredictLowestPrice,
        PredictEarningRatio,
        PredictLossRatio,
        RiskEarningRatio,
        EPSYoY,
        PEG,
        isValidCompluted,
        rank
    }
}


// ============================
// ============================
module.exports.calculate = data => {
    clearAll();

    /* ===============
       1. 預估本益比區間
    ================= */
    isValidOfPEAverage = true;
    let H_PER = data.getPE("Y_max").slice(0, 6);
    let L_PER = data.getPE("Y_min").slice(0, 6);
    const a_AvgMaxPE = getPEAverage(H_PER, "MAX");
    const a_AvgMinPE = getPEAverage(L_PER, "MIN");
    // let a_PredictPE;
    if (isValidOfPEAverage) {
        const s_LastMaxPE = H_PER[0];
        const s_LastMinPE = L_PER[0];
        //平均值要跟最新得數值比大小，都取最小值
        PredictPE = [Math.min(a_AvgMaxPE, s_LastMaxPE), Math.min(a_AvgMinPE, s_LastMinPE)];
        // console.log(AvgMaxPE,AvgMinPE);
    }

    /* ===============
      2. 預估營收年增率
	  條件：
		1.近6個月營收年增率不能有負值
		2."最新的月營收年增率"與這"六個月的平均"，取出最小值當作預估營收年增率
	================= */
    isValidOfpredictProfitMonthYoY = true;
    let MonthOfChianYear = "2018.02";
    let profitMonthYoY = data.getOperatingRevenue("M_YoY").slice(0, 6);
    let profitMonthYoY_Month = data.getOperatingRevenue("M_TIME").slice(0, 6);
    let count = 0;
    let sumOFprofitMonthYoY = profitMonthYoY.reduce((acc, cur, i) => {
        if ((cur < 0 && profitMonthYoY_Month !== MonthOfChianYear) || !isValidOfpredictProfitMonthYoY) {
          isValidOfpredictProfitMonthYoY = false;
            return acc;
        }
        count ++;
        return acc + cur;
    },0);
    if (isValidOfpredictProfitMonthYoY) {
        let averageOFprofitMonthYoY = sumOFprofitMonthYoY / count;
        predictProfitMonthYoY = Math.min(profitMonthYoY[0], averageOFprofitMonthYoY);
    }

    /* ===============
      3. 預估營收
	  算法： 去年營收*(1+預估營收年增率/100 )
    ================= */
    let s_YearEarning_Y = data.getOperatingRevenue("Y_value")[0];
    // console.log(s_YearEarning_Y);
    if (isValidOfpredictProfitMonthYoY) {
        PredictedEarning = s_YearEarning_Y * (1 + predictProfitMonthYoY / 100);
    }

    /* ===============
      4. 預估稅後淨利率
	  算法: 過去4季(稅後淨利/營業收入)的平均
	================= */
    isValidOfPredictProfitRatio = true;
    let a_NetProfit_afterTax = data.getNetIncome("Q_afterTax").slice(0, 4); //抓四季就好
    let OperatingRevenueQuarterly = data.getOperatingRevenue("Q_value").slice(0, 4);
    let sumOFProfitRatio = a_NetProfit_afterTax.reduce((acc, cur, i) => {
        let OR_M = OperatingRevenueQuarterly[i];
        if (cur < 0 || OR_M < 0) isValidOfPredictProfitRatio = false;
        // console.log(acc,cur,OR_M,cur/OR_M,i);
        return acc + cur / OR_M;
    }, 0);
    if (isValidOfPredictProfitRatio) {
      PredictProfitRatio = sumOFProfitRatio / 4;
    }

    if (isValidOfPEAverage
        && isValidOfpredictProfitMonthYoY
        && isValidOfPredictProfitRatio ) {
        /* ===============
          5. 預估EPS
           算法: (預測營收 * 預估稅後淨後率 * 100)÷股本×10
                  =(過去的營收×預估的營收年增率×預估稅後淨後率)÷股本×10
        ================= */
        let Capital = data.getCapital("Q_value")[0];
        PredictEPS = (PredictedEarning * PredictProfitRatio * 100 / Capital * 10);

        /* ===============
          6. 預估股價高低落點
        ================= */
        PredictHighestPrice = PredictEPS * PredictPE[0]; //Max
        PredictLowestPrice = PredictEPS * PredictPE[1]; //Min

        /* ===============
          7. 預估報酬率
        ================= */
        let currentStockValue = data.getPrice("D_closingPrice");
        PredictEarningRatio = (PredictHighestPrice - currentStockValue) / currentStockValue;

        /* ===============
          8. 預估風險
        ================= */
        PredictLossRatio = (currentStockValue - PredictLowestPrice) / currentStockValue;

        /* ===============
          9. 風險報酬倍數
        ================= */
        if (PredictLossRatio < 0) {
          //小於0表示沒風險，所以以一個很小的非零數值取代
          RiskEarningRatio = Math.abs(PredictEarningRatio / 0.0001);
        } else {
          RiskEarningRatio = Math.abs(PredictEarningRatio / PredictLossRatio);
        }

        /* ===============
          10. 計算過去兩年EPS的年增率
             算法： 去年/前年 -1
        ================= */
        let EPSYear = data.getEPS("Y_value").slice(0,2);
        EPSYoY = EPSYear[0] / EPSYear[1] - 1;

        /* ===============
          11. 計算PEG
             算法： 本益比 / EPS年增率
             概念：EPS=稅後淨利除以股本乘以10，納入了股本因素
                  畢竟股本如果膨脹會有稀釋效果，用EPS成長率更能代表公司的獲利成長情況。
             判斷：台股PEG能降到0.4以下才稱得上具有股價低估的投資價值
        ================= */
        PEG = currentStockValue / PredictEPS / EPSYoY / 100;

        // finally setup boolean and rank
        isValidCompluted = true;
        rank = RiskEarningRatio;
    }
    let response = {
        isValidOfPEAverage,
        PredictPE,
        isValidOfpredictProfitMonthYoY,
        predictProfitMonthYoY,
        PredictedEarning,
        isValidOfPredictProfitRatio,
        PredictProfitRatio,
        PredictEPS,
        PredictHighestPrice,
        PredictLowestPrice,
        PredictEarningRatio,
        PredictLossRatio,
        RiskEarningRatio,
        EPSYoY,
        PEG,
        isValidCompluted,
        rank
    }
    // console.log(response)
    return response;
}


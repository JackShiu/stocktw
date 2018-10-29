

module.exports.getDisplay = (stockID = "NULL", o_WebAddress = {}, info ={}, cal = {}) =>(
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
`);

module.exports.updateBaicInfoWeb = (res, info) => {
    // let res = await getBasicInfoWeb(stockID, options);
    // await delay(parseInt(60 * (Math.random() + 1)));
    info.setStockName(res.s_stockName);
    info.setProductType(res.s_ProductType);
    info.setPrice("D_closingPrice", res.s_closingPrice);
    info.setPE("D_current", res.s_current_PE);
    info.setPE("Y_max", res.a_H_PER);
    info.setPE("Y_min", res.a_L_PER);
    info.setPE("Y_TIME", res.Y_TIME);
    info.setCapital("D_Current", res.s_Capital);
    info.setPrice("D_dailyPricing", res.s_DailyPricing);
    info.setFundamentalAnalysis("W_ROI", res.s_ROI_W);
    info.setFundamentalAnalysis("M_ROI", res.s_ROI_M);
    info.setFundamentalAnalysis("S_dividend", res.s_Dividend);
    info.setFundamentalAnalysis("S_dividendYield", res.s_DividendYield);
    info.setFundamentalAnalysis("S_debtRatio", res.s_DebtRatio);
    info.setFundamentalAnalysis("S_PBR", res.s_PBR);
    info.setTempValue("Temp_Q_TIME", res.s_Q_TIME);
    //update time
    let time = info.getUpdatedTime("D_TIME")||[];
    time[0] = res.s_D_TIME;
    info.setUpdatedTime("D_TIME", time);
    return info;
}

module.exports.updateInstitutionalInvestor = (res, info) => {
    info.setChipAnalysis("D_TIME", res.a_D_TIME);
    info.setChipAnalysis("D_FIR", res.a_D_FIR);
    info.setChipAnalysis("D_IIR", res.a_D_IIR);
    info.setChipAnalysis("D_NBNS", res.s_D_NBNS);
    //update time
    let time = info.getUpdatedTime("D_TIME") || [];
    time[1] = res.a_D_TIME[0];
    info.setUpdatedTime("D_TIME", time);
    return info;
}

module.exports.updateCandlestickChart = (res, info) => {
    info.setPrice("D_TIME", res.a_D_TIME);
    info.setPrice("D_OpenPrice", res.a_D_OpenPrice);
    info.setPrice("D_HeightestPrice", res.a_D_HeightestPrice);
    info.setPrice("D_LowestPrice", res.a_D_LowestPrice);
    info.setPrice("D_ClosePrice", res.a_D_ClosePrice);
    info.setPrice("D_Volume", res.a_D_Volume);
    //update time
    let time = info.getUpdatedTime("D_TIME") || [];
    let [Y, M, D] = res.a_D_TIME[res.a_D_TIME.length - 1].split('/');
    time[2] = `${M}/${D}`;
    info.setUpdatedTime("D_TIME", time);
    // console.log(info.getUpdatedTime());
    return info;
};

module.exports.updateRevenueWeb_M = (res, info) => {
    info.setOperatingRevenue("M_value", res.a_OperatingRevenue_M);
    info.setOperatingRevenue("M_YoY", res.a_OperatingRevenue_M_YoY);
    info.setOperatingRevenue("M_TIME", res.M_TIME);
    info.setUpdatedTime("M_TIME", res.M_TIME[0]);
    return info;
}

module.exports.updateEarningpower = (res, info) => {
    info.setGrossProfit("Q_TIME", res.a_Q_TIME);
    info.setOperatingProfitMargin("Q_TIME", res.a_Q_TIME);
    info.setGrossProfit("Q_value", res.a_GrossProfit);
    info.setOperatingProfitMargin("Q_value", res.a_OperatingProfitMargin);
    //update time
    let time = info.getUpdatedTime("Q_TIME") || [];
    time[0] = res.a_Q_TIME[0];
    info.setUpdatedTime("Q_TIME", time);
    // console.log(res.a_Q_TIME);
    return info;
};

module.exports.updatePerformanceWeb_S = (res, info) => {
    info.setOperatingRevenue("Q_value", res.a_OperatingRevenue_Q);
    info.setOperatingRevenue("Q_TIME", res.Q_TIME);
    info.setNetIncome("Q_afterTax", res.a_NetIncome_Q_afterTax);
    info.setNetIncome("Q_beforeTax", res.a_NetIncome_Q_beforTax);
    info.setNetIncome("Q_TIME", res.Q_TIME);
    info.setEPS("Q_value", res.a_EPS_Q);
    info.setEPS("Q_TIME", res.Q_TIME);
    info.setCapital("Q_value", res.a_Capital_Q);
    info.setCapital("Q_TIME", res.Q_TIME);
    //update time
    let time = info.getUpdatedTime("Q_TIME") || [];
    time[1] = res.Q_TIME[0];
    info.setUpdatedTime("Q_TIME", time);
    return info;
}

module.exports.updatePerformanceWeb_Y = (res, info) => {
    info.setOperatingRevenue("Y_value", res.a_OperatingRevenue_Y);
    info.setOperatingRevenue("Y_TIME", res.Y_TIME);
    info.setEPS("Y_value", res.a_EPS_Y);
    info.setEPS("Y_TIME", res.Y_TIME);
    info.setUpdatedTime("Y_TIME", res.Y_TIME[0]);
    return info;
};



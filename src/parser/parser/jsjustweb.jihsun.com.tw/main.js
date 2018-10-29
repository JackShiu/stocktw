const { queryService, fetchData } = require("../util/util");

const { extractBasicInfo} = require("./basicInfoWeb");
const { extractRevenueMonthly} = require("./revenueWeb_M");
const { extractPerformance_S} = require("./performanceWeb_S");
const { extractPerformance_Y} = require("./performanceWeb_Y");
const { extractInstitutionalInvestor } = require("./institutionalInvestor");
const { extractCandlestickChart } = require("./candlestickChart");
const { extractEarningpower } = require("./earningPower");

module.exports.getWebAddress = getWebAddress = stockID => {
    const BasicInfoWeb = `http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_${stockID}.djhtm`;
    const RevenueWeb_M = `http://jsjustweb.jihsun.com.tw/z/zc/zch/zch_${stockID}.djhtm`;
    const PerformanceWeb_S = `http://jsjustweb.jihsun.com.tw/z/zc/zcd_${stockID}.djhtm`;
    const PerformanceWeb_Y = `http://jsjustweb.jihsun.com.tw/z/zc/zcdj_${stockID}.djhtm`;
    const InstitutionalInvestor = `http://jsjustweb.jihsun.com.tw/z/zc/zcl/zcl.djhtm?a=${stockID}&b=2`;
    const CandlestickChart = `http://jsjustweb.jihsun.com.tw/z/BCD/czkc1.djbcd?a=${stockID}&b=D&c=60&E=1&ver=5`;
    const Earningpower = `http://jsjustweb.jihsun.com.tw/z/zc/zce/zce_${stockID}.djhtm`;
    return {
        BasicInfoWeb,
        RevenueWeb_M,
        PerformanceWeb_S,
        PerformanceWeb_Y,
        InstitutionalInvestor,
        CandlestickChart,
        Earningpower
    }
}

const myWeb = getWebAddress;

module.exports.getBasicInfoWeb = async(stockID, option) => {
    const {BasicInfoWeb} = myWeb(stockID);
    return  await queryService(BasicInfoWeb, extractBasicInfo, option);
}

module.exports.getRevenueWeb_M = async (stockID, option) => {
    const { RevenueWeb_M } = myWeb(stockID);
    return await queryService(RevenueWeb_M, extractRevenueMonthly, option);
}

module.exports.getPerformanceWeb_S = async (stockID, option) => {
    const { PerformanceWeb_S } = myWeb(stockID);
    return await queryService(PerformanceWeb_S, extractPerformance_S, option);
}

module.exports.getPerformanceWeb_Y = async (stockID, option) => {
    const { PerformanceWeb_Y } = myWeb(stockID);
    return await queryService(PerformanceWeb_Y, extractPerformance_Y, option);
}

module.exports.getInstitutionalInvestor = async (stockID, option) => {
    const { InstitutionalInvestor } = myWeb(stockID);
    return await queryService(InstitutionalInvestor, extractInstitutionalInvestor, option);
}
module.exports.getCandlestickChart = async (stockID, option) => {
    const { CandlestickChart } = myWeb(stockID);
    return await queryService(CandlestickChart, extractCandlestickChart, option);
}

module.exports.getEarningpower = async (stockID, option) => {
    const { Earningpower } = myWeb(stockID);
    return await queryService(Earningpower, extractEarningpower, option);
}

/*
parsing four page from http://jsjustweb.jihsun.com.tw
@depreciated
this is function is not supported after v2
example:
http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_2330.djhtm
http://jsjustweb.jihsun.com.tw/z/zc/zch/zch_2330.djhtm
http://jsjustweb.jihsun.com.tw/z/zc/zcd_2330.djhtm
http://jsjustweb.jihsun.com.tw/z/zc/zcdj_2330.djhtm

*/
module.exports.getAllStockData = async (stockID, option) => {
    //Await Sequentially
    let web1 = await queryService(BasicInfoWeb, extractBasicInfo, option);
    let web2 = await queryService(RevenueWeb_M, extractRevenueMonthly, option);
    let web3 = await queryService(PerformanceWeb_S, extractPerformance_S, option);
    let web4 = await queryService(PerformanceWeb_Y, extractPerformance_Y, option);
    let web5 = await queryService(InstitutionalInvestor, extractInstitutionalInvestor, option);

    let data = {
        stockID,
        BasicInfoWeb,
        RevenueWeb_M,
        PerformanceWeb_S,
        PerformanceWeb_Y,
        ...web1,
        ...web2,
        ...web3,
        ...web4
    }
    //console.log(data)
    return data;
};

const { queryService} = require("../util/util");

const { extractBasicInfo} = require("./basicInfoWeb");
const { extractRevenueMonthly} = require("./revenueWeb_M");
const { extractPerformance_S} = require("./performanceWeb_S");
const { extractPerformance_Y} = require("./performanceWeb_Y");

/*
parsing four page from http://jsjustweb.jihsun.com.tw

example:
http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_2330.djhtm
http://jsjustweb.jihsun.com.tw/z/zc/zch/zch_2330.djhtm
http://jsjustweb.jihsun.com.tw/z/zc/zcd_2330.djhtm
http://jsjustweb.jihsun.com.tw/z/zc/zcdj_2330.djhtm

*/
module.exports.getStockData = async (stockID, option) => {
    const BasicInfoWeb = `http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_${stockID}.djhtm`;
    const RevenueWeb_M = `http://jsjustweb.jihsun.com.tw/z/zc/zch/zch_${stockID}.djhtm`;
    const PerformanceWeb_S = `http://jsjustweb.jihsun.com.tw/z/zc/zcd_${stockID}.djhtm`;
    const PerformanceWeb_Y = `http://jsjustweb.jihsun.com.tw/z/zc/zcdj_${stockID}.djhtm`;

    //Await Sequentially
    let web1 = await queryService(BasicInfoWeb, extractBasicInfo, option);
    let web2 = await queryService(RevenueWeb_M, extractRevenueMonthly, option);
    let web3 = await queryService(PerformanceWeb_S, extractPerformance_S, option);
    let web4 = await queryService(PerformanceWeb_Y, extractPerformance_Y, option);

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
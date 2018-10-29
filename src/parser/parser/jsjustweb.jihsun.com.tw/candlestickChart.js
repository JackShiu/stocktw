const { parseValue } = require("../util/util.js");

/* =====Web Page ==== */
//http://jsjustweb.jihsun.com.tw/z/BCD/czkc1.djbcd?a=1477&b=D&c=60&E=1&ver=5
//這是直接拿到raw data;

module.exports.extractCandlestickChart = ($, option) => {

    let allData = $.text().split(" ");


    let a_D_TIME = chagneStringtoArray(allData[0]);
    let a_D_OpenPrice = chagneStringtoArray(allData[1]);
    let a_D_HeightestPrice = chagneStringtoArray(allData[2]);
    let a_D_LowestPrice = chagneStringtoArray(allData[3]);
    let a_D_ClosePrice = chagneStringtoArray(allData[4]);
    let a_D_Volume = chagneStringtoArray(allData[5]);
    return { a_D_TIME, a_D_OpenPrice, a_D_HeightestPrice, a_D_LowestPrice, a_D_ClosePrice, a_D_Volume };
}


const chagneStringtoArray = value => {
    let array = value.split(',');
    // // 只存60筆
    // let set = array.length - 60;
    // return array.slice(set);
    return array;

}

const getMovingAverage = (interval, data) => {
    if (data.length < interval) return null;
    return data.map( (v, i )=>{
        if (i < interval -1 ) return 0;
        return data.slice(i - interval+1, i+1).reduce((a, b) => a + b, 0);
    });
}
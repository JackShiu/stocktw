
const getDelta = (range, data) => {
    if (data.length < range || data[range - 1] === 0 ) return -10000;
    return data[0] - data[range -1]
}

const getPrecentage = (range, data) => {
    if (data.length < range || data[range - 1] === 0 ) return -10000;
    return getDelta(range, data) / data[range -1] * 100;
}


export let rankObj = [
    {
        name: "R_estimated", //估算
        display: "估算排序",
        type: "basic",
        getValue: info => info.RiskEarningRatio,
        compare: (a, b) => b - a
    },
    {
        name: "R_deltaChange_P", //漲幅
        display: "漲幅排序(一)",
        type: "basic",
        getValue: info => {
            let cP = info.info.getPrice("D_closingPrice");
            let dP = info.info.getPrice("D_dailyPricing");
            return (dP / (cP - dP)) * 100;
        },
        compare: (a, b) => b - a
    },
    {
        name: "R_deltaChange_P_r5", //漲幅
        display: "漲幅排序(五)",
        type: "basic",
        getValue: info => {
            let a_price = info.info.getPrice("D_ClosePrice") || [0];
            // let delta = 5;
            // let p0 = a_price[0];
            // let p5 = a_price[delta -1];
            // let test =  getPrecentage(6, a_price);
            // // if (info.info.getBasicID() === "8080")
            //     console.log(info.info.getBasicID(), test, a_price);
            return getPrecentage(6, a_price);
        },
        compare: (a, b) => b - a
    },
    {
        name: "R_deltaChange_N", //漲幅
        display: "跌幅排序(一)",
        type: "basic",
        getValue: info => info.R_deltaChange_P,
        compare: (a, b) => b - a
    },
    {
        name: "R_volume_P", //成交量
        display: "成交量排序(一)",
        type: "basic",
        getValue: info => {
            let volume = info.info.getPrice("D_Volume");
            if (volume.length > 0)
                return volume[0]
            return 0;
        },
        compare: (a, b) => b -a
    },
    {
        name: "R_DailyTradingVolume", //成交價
        display: "成交價排序(一)",
        type: "basic",
        getValue: info => {
            let cP = info.info.getPrice("D_closingPrice");
            let a_volume = info.info.getPrice("D_Volume");
            let volume = 0;
            if (a_volume.length > 0)
                volume = a_volume[0];
            return cP* volume;
        },
        compare: (a, b) => b -a
    },
    {
        name: "R_chip_IIR_B_Div1", //籌碼面
        display: "法人買(ㄧ)",
        type: "basic",
        getValue: info => {
            let data = info.info.getChipAnalysis("D_IIR");
            if (data.length > 0) {
                return getDelta(2, data);
            } else {
                return -1;
            }
        },
        compare: (a, b) => b - a
    },
    {
        name: "R_chip_IIR_B_Div3", //籌碼面
        display: "法人買(三)",
        type: "basic",
        getValue: info => {
            let data = info.info.getChipAnalysis("D_IIR");
            if (data.length > 0) {
                return getDelta(3,data);
            } else {
                return -1;
            }
        },
        compare: (a, b) => b - a
    },
    {
        name: "R_chip_IIR_B_Div5", //籌碼面
        display: "法人買(五)",
        type: "basic",
        getValue: info => {
            let data = info.info.getChipAnalysis("D_IIR");
            if (data.length > 0) {
                return getDelta(5,data);
            } else {
                return -1;
            }
        },
        compare: (a, b) => b - a
    },
    {
        name: "R_chip_FIR_B_Div1", //籌碼面
        display: "外資買(一)",
        type: "basic",
        getValue: info => {
            let data = info.info.getChipAnalysis("D_FIR");
            if (data.length > 0) {
                return getDelta(2,data);
            } else {
                return -1;
            }
        },
        compare: (a, b) => b - a
    },
    {
        name: "R_chip_FIR_B_Div3", //籌碼面
        display: "外資買(三)",
        type: "basic",
        getValue: info => {
            let data = info.info.getChipAnalysis("D_FIR");
            if (data.length > 0) {
                return getDelta(3,data);
            } else {
                return -1;
            }
        },
        compare: (a, b) => b - a
    },
    {
        name: "R_chip_FIR_S_Div3", //籌碼面
        display: "外資賣(三)",
        type: "basic",
        getValue: info => {
            let data = info.info.getChipAnalysis("D_FIR");
            if (data.length > 0) {
                return data[2] - data[0];
            } else {
                return -1;
            }
        },
        compare: (a, b) =>  b - a
    },
    {
        name: "R_dividend", //股利
        display: "殖利率排序",
        type: "basic",
        getValue: info => info.info.getFundamentalAnalysis("S_dividendYield"),
        compare: (a, b) => b - a
    },
    {
        name: "R_estimated_Ad_1",
        display: "估算排序+條件.1",
        type: "advanced",
        tooltip:'估算(序)+基本面(近一季盈利率季增>0)＋即時性(法人站買三日)',
        getValue: info => info.RiskEarningRatio,
        compare: (a, b) => b - a,
        filter: info => {
            let OperatingProfitMargin = info.info.getOperatingProfitMargin("Q_value")[0];
            let a_IIR = info.info.getChipAnalysis("D_IIR");
            let delta_IIR = a_IIR.length > 0 ? a_IIR[0] - a_IIR[2] : -1000;
            if (OperatingProfitMargin > 0 && delta_IIR >0 ){
                return true;
            } else {
                return false
            }
        }
    },
    {
        name: "R_chip_FIR_Ad_1",
        display: "法人排序+條件.1",
        type: "advanced",
        tooltip:'法人買一(序)+三天漲幅<15%',
        getValue: info => info.R_chip_IIR_B_Div1,
        compare: (a, b) => a - b ,
        filter: info => {
            let price = info.info.getPrice("D_ClosePrice") || [0];
            let length = price.length;
            // let delta = 3;
            // let deltaPrice = price[0] - price[delta -1];
            let percentage = getPrecentage(3, price);
            if (percentage > 0 && percentage < 15) {
                return true;
            }
            return false
        }
    },
    {
        name: "R_chip_FIR_Ad_2",
        display: "法人排序+條件.2",
        type: "advanced",
        tooltip:'法人買三(序)+三天漲幅<15%',
        getValue: info => info.R_chip_IIR_B_Div3,
        compare: (a, b) => a - b,
        filter: info => {
            let price = info.info.getPrice("D_ClosePrice") || [0];
            let length = price.length;
            // let delta = 3;
            // let deltaPrice = price[0] - price[delta - 1];
            let percentage = getPrecentage(3, price);
            if (percentage > 0 && percentage < 15) {
                return true;
            }
            return false
        }
    },
    {
        name: "R_chip_FIR_Ad_3",
        display: "法人排序+條件.3",
        type: "advanced",
        tooltip:'法人買三(序)+站上5MA,10MA,20MA +爆大量(相對過去10天)1.5倍 ',
        getValue: info => info.R_chip_IIR_B_Div3,
        compare: (a, b) => a - b,
        filter: info => {
            let a_price = info.info.getPrice("D_ClosePrice") || [0];
            let price = a_price[0];
            let MA5 = info.MA5[0];
            let MA10 = info.MA10[0];
            let MA20 = info.MA20[0];
            if (price < MA5) return false;
            if (price < MA10) return false;
            if (price < MA20) return false;
            let a_volume = info.info.getPrice("D_Volume") || [0];
            let volume = a_volume[0];
            let Volume_MA10 = info.Volume_MA10;
            if (volume < Volume_MA10 * 1.5) return false;
            return true;
        }
    },
    // {
    //     name: "R_HotStock_Select_Ad_1",
    //     display: "成交價序＋條件.1",
    //     type: "advanced",
    //     tooltip: '成交量正規化序(一) + 站上5MA,10MA,20MA +爆大量(相對過去10天)1.5倍 + 法人買(ㄧ)',
    //     getValue: info => {
    //         let tradingVolume = info.R_DailyTradingVolume || 0;
    //         let captial = info.info.getCapital("D_Current") ||1;
    //         // console.log(tradingVolume , captial);
    //         // tradingVolume %= 1000000000;
    //         return tradingVolume / captial * 100 ;
    //     },
    //     compare: (a, b) => a - b,
    //     filter: info => {
    //         let a_price = info.info.getPrice("D_ClosePrice")[0] || [0];
    //         let price = a_price[a_price.length -1 ];
    //         let MA5 = info.MA5;
    //         let MA10 = info.MA10;
    //         let MA20 = info.MA20;
    //         if(price < MA5) return false;
    //         if(price < MA10) return false;
    //         if(price < MA20) return false;
    //         let a_volume = info.info.getPrice("D_Volume") || [0];
    //         let volume = a_volume[a_volume.length - 1];
    //         let Volume_MA10 = info.Volume_MA10;
    //         if (volume < Volume_MA10 * 1.5 ) return false;
    //         let IIR_B_Div1 = info.R_chip_IIR_B_Div1; //法人買一
    //         if (IIR_B_Div1 < 0) return false;
    //         //
    //         return true;
    //     }
    // },
];



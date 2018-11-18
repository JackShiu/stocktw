
export let rankObj = [
    {
        name: "R_estimated", //估算
        display: "估算排序",
        type: "basic",
        getValue: info => info.RiskEarningRatio,
        compare: (a, b) => b - a
    },
    {
        name: "R_chip_IIR_B_Div1", //籌碼面
        display: "法人買(ㄧ)",
        type: "basic",
        getValue: info => {
            let data = info.info.getChipAnalysis("D_IIR");
            if (data.length > 0) {
                return data[0] - data[1]
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
                return data[0] - data[2]
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
                return data[0] - data[4]
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
                return data[0] - data[1]
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
                return data[0] - data[2]
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
                return data[2] - data[0]
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
        getValue: info => {
            let data = info.info.getChipAnalysis("D_IIR");
            if (data.length > 0) {
                return data[0] - data[1]
            } else {
                return -1;
            }
        },
        compare: (a, b) => b - a,
        filter: info => {
            let price = info.info.getPrice("D_ClosePrice") || [0];
            let length = price.length;
            let delta = 3;
            let deltaPrice = price[length - 1] - price[length - delta];
            let percentage = (deltaPrice / price[length - delta]) * 100;
            if (length >= delta && percentage < 15){
                return true
            }
            return false
        }
    },
    {
        name: "R_chip_FIR_Ad_2",
        display: "法人排序+條件.2",
        type: "advanced",
        tooltip:'法人買三(序)+三天漲幅<15%',
        getValue: info => {
            let data = info.info.getChipAnalysis("D_IIR");
            if (data.length > 0) {
                return data[0] - data[2]
            } else {
                return -1;
            }
        },
        compare: (a, b) => b - a,
        filter: info => {
            let price = info.info.getPrice("D_ClosePrice") || [0];
            let length = price.length;
            let delta = 3;
            let deltaPrice = price[length - 1] - price[length - delta];
            let percentage = (deltaPrice / price[length - delta]) * 100;
            if (length >= delta && percentage < 15){
                return true
            }
            return false
        }
    },
];



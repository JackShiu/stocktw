

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
        name: "R_dividend", //股利
        display: "殖利率排序",
        type: "basic",
        getValue: info => info.info.getFundamentalAnalysis("S_dividendYield"),
        compare: (a, b) => b - a
    }
];



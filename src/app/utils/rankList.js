

export let rankObj = [
    {
        name: "R_estimated", //估算
        display: "估算排序",
        type: "basic",
        getValue: info => info.RiskEarningRatio,
        compare: (a, b) => b - a
    },
    {
        name: "R_chip_IIR_Div3", //籌碼面
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
        name: "R_chip_IIR_Div1", //籌碼面
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
        name: "R_chip_IIR_Div5", //籌碼面
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
        name: "R_dividend", //股利
        getValue: info => info.info.getFundamentalAnalysis("S_dividendYield"),
        compare: (a, b) => b - a
    }
];


// let advancedRankObj = [];

// let extendMoudle = []

// let getRankList = () => {

// }


// class moduleController {
//     constructor(){
//     }
//     isBasicModule(name){
//         // return Object.keys()
//         let isSame = false
//         basicRankModule.forEach(obj => {
//            if(obj.name === name) isSame = true;
//         });
//         return isSame;
//     }
//     // getList(info, name)
// }


// export default moduleController;

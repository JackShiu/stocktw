/*---------------------------------*/
/* utils                           */
/*---------------------------------*/
/*
    Function getMovingAverage
    parameters:
        interval: 5,10,20,60
        data: integer array ([1,2,3,4,5])
*/
const getMovingAverage = (interval, data) => {
    if (data.length < interval) return [0];
    return data.map((v, i) => {
        let innerVal = data.slice(i, i + interval);
        if (innerVal.length < interval) return 0;
        return innerVal.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / interval;
    });
}

/*---------------------------------*/
/* stockInf                        */
/*---------------------------------*/

module.exports.getEmptyStockInfo = getEmptyStockInfo = function () {
    return ({
        s_Name: null,
        s_ProductType: null,
        o_UpdateTime: {
            a_D_TIME: [], // 10/30
            s_M_TIME: null, //2018.08
            a_Q_TIME: [], //2018.1Q
            s_Y_TIME: null //2018
        },
        o_TempValue:{
            s_Q_TIME: null
        },
        o_Price: {
            s_closingPrice: null, //當日收盤價
            s_maxInYear: null,
            s_minInYear: null,
            s_dailyPricing: null, // 當日漲跌,
            a_D_TIME: [],
            a_D_OpenPrice: [],
            a_D_HeightestPrice: [],
            a_D_LowestPrice: [],
            a_D_ClosePrice: [],
            a_D_Volume: [],
        },
        o_FundamentalAnalysis: { // 基本面
            s_dividend: null,    //股利
            s_dividendYield: null, //殖利率
            s_debtRatio: null,   //負債比
            s_PBR: null,         //股價淨值比
            s_W_ROI: null,       //近一週報酬率
            s_M_ROI: null,       //近一月報酬率
        },
        o_ChipAnalysis: { // 籌碼面
            a_D_TIME: [],
            a_D_FIR: [], //Foreign investor ratio
            a_D_IIR: [], //Institutional investors ratio
            s_D_NBNS: null //net buy/ net sell
        },
        o_TechnicalAnalysis: { //技術面
            s_D_MA5: null,
            s_D_MA10: null,
            s_D_MA60: null
        },
        o_Capital: {
            a_Q_value: [],
            a_Q_TIME: [],
            s_current: null //億單位
        },
        o_PE: {
            s_current: null,
            a_Y_max: [],
            a_Y_min: [],
            a_Y_TIME: []
        },
        o_EPS: {
            a_M_value: [],
            a_Q_value: [],
            a_Y_value: [],
            a_M_TIME: [],
            a_Q_TIME: [],
            a_Y_TIME: []
        },
        o_OperatingRevenue: {
            a_M_value: [],
            a_Q_value: [],
            a_Y_value: [],
            a_M_MoM: [],
            a_M_YoY: [],
            a_M_TIME: [],
            a_Q_TIME: [],
            a_Y_TIME: []
        },
        o_GrossProfit: { //毛利率
            a_Q_value: [],
            a_Q_TIME: []
        },
        o_OperatingProfitMargin: { //營業利益率
            a_Q_value: [],
            a_Q_TIME: []
        },
        a_OperatingCost: [],
        a_OperatingIncome: [],
        a_OperatingExpend: [],
        o_NetIncome: {
            a_Q_afterTax: [],
            a_Q_beforeTax: [],
            a_Y_afterTax: [],
            a_Y_beforeTax: [],
            a_Q_TIME: [],
            a_Y_TIME: []
        }
    })
}

function stockInfo(val){
    // this.info = val || getEmptyStockInfo();
    this.info = Object.assign(getEmptyStockInfo(), val);
}
stockInfo.prototype.export = function () {
    return this.info;
}
stockInfo.prototype.setStockName = function(data){
    this.info.s_Name = data;
}
stockInfo.prototype.getStockName = function(){
    return this.info.s_Name;
}
stockInfo.prototype.setProductType = function(data){
    this.info.s_ProductType = data;
}
stockInfo.prototype.getProductType = function () {
    return this.info.s_ProductType;
}

stockInfo.prototype.setTempValue = function (type, value = null){
    switch (type) {
            case "Temp_Q_TIME":
            this.info.o_TempValue.s_Q_TIME = value;
        break;
    }
}
stockInfo.prototype.getTempValue = function (type) {
    switch (type) {
        case "Temp_Q_TIME":
            return this.info.o_TempValue.s_Q_TIME;
            break;
        default:
            return this.info.o_TempValue;
            break;
    }
}
stockInfo.prototype.setUpdatedTime = function (type, time = null){
    switch (type) {
            case "D_TIME":
            this.info.o_UpdateTime.a_D_TIME = time;
        break;
            case "M_TIME":
            this.info.o_UpdateTime.s_M_TIME = time;
        break;
            case "Q_TIME":
            this.info.o_UpdateTime.a_Q_TIME = time;
        break;
            case "Y_TIME":
            this.info.o_UpdateTime.s_Y_TIME = time;
        break;
    }
}
stockInfo.prototype.getUpdatedTime = function(type){
    switch (type) {
        case "D_TIME":
            return this.info.o_UpdateTime.a_D_TIME;
            break;
        case "M_TIME":
            return this.info.o_UpdateTime.s_M_TIME;
            break;
        case "Q_TIME":
            return this.info.o_UpdateTime.a_Q_TIME;
            break;
        case "Y_TIME":
            return this.info.o_UpdateTime.s_Y_TIME;
            break;
        default:
            return this.info.o_UpdateTime;
            break;
    }
}
stockInfo.prototype.setPrice = function (type, data = null){
    switch (type) {
        case "D_closingPrice":
            this.info.o_Price.s_closingPrice = data;
            break;
        case "D_maxInYear":
            this.info.o_Price.s_maxInYear = data;
            break;
        case "D_minInYear":
            this.info.o_Price.s_minInYear = data;
            break;
        case "D_dailyPricing":
            this.info.o_Price.s_dailyPricing = data;
            break;
        case "D_TIME":
            this.info.o_Price.a_D_TIME = data;
            break;
        case "D_OpenPrice":
            this.info.o_Price.a_D_OpenPrice = data;
            break;
        case "D_HeightestPrice":
            this.info.o_Price.a_D_HeightestPrice = data;
            break;
        case "D_LowestPrice":
            this.info.o_Price.a_D_LowestPrice = data;
            break;
        case "D_ClosePrice":
            this.info.o_Price.a_D_ClosePrice = data;
            break;
        case "D_Volume":
            this.info.o_Price.a_D_Volume = data;
            break;
    }
}
stockInfo.prototype.getPrice = function(type){
    switch (type) {
        case "D_closingPrice": //當日收盤價
            return this.info.o_Price.s_closingPrice;
            break;
        case "D_maxInYear":
            return this.info.o_Price.s_maxInYear;
            break;
        case "D_minInYear":
            return this.info.o_Price.s_minInYear;
            break;
        case "D_dailyPricing":
            return this.info.o_Price.s_dailyPricing;
            break;
        case "D_TIME":
            return this.info.o_Price.a_D_TIME;
            break;
        case "D_OpenPrice":
            return this.info.o_Price.a_D_OpenPrice;
            break;
        case "D_HeightestPrice":
            return this.info.o_Price.a_D_HeightestPrice;
            break;
        case "D_LowestPrice":
            return this.info.o_Price.a_D_LowestPrice;
            break;
        case "D_ClosePrice": //每日收盤價 array
            return this.info.o_Price.a_D_ClosePrice;
            break;
        case "D_Volume":
            return this.info.o_Price.a_D_Volume;
            break;
        default:
            return this.info.o_Price;
            break;
    }
}

stockInfo.prototype.setFundamentalAnalysis = function (type, data = null) {
    switch (type) {
        case "S_dividend":
            this.info.o_FundamentalAnalysis.s_dividend = data;
            break;
        case "S_dividendYield":
            this.info.o_FundamentalAnalysis.s_dividendYield = data;
            break;
        case "S_debtRatio":
            this.info.o_FundamentalAnalysis.s_debtRatio = data;
            break;
        case "S_PBR":
            this.info.o_FundamentalAnalysis.s_PBR = data;
            break;
        case "W_ROI":
            this.info.o_FundamentalAnalysis.s_W_ROI = data;
            break;
        case "M_ROI":
            this.info.o_FundamentalAnalysis.s_M_ROI = data;
            break;
    }
}

stockInfo.prototype.getFundamentalAnalysis = function (type) {
    switch (type) {
        case "S_dividend":
            return this.info.o_FundamentalAnalysis.s_dividend;
            break;
        case "S_dividendYield":
            return this.info.o_FundamentalAnalysis.s_dividendYield;
            break;
        case "S_debtRatio":
            return this.info.o_FundamentalAnalysis.s_debtRatio;
            break;
        case "S_PBR":
            return this.info.o_FundamentalAnalysis.s_PBR;
            break;
        case "W_ROI":
            return this.info.o_FundamentalAnalysis.s_W_ROI;
            break;
        case "M_ROI":
            return this.info.o_FundamentalAnalysis.s_M_ROI;
            break;
        default:
            return this.info.o_FundamentalAnalysis ;
            break;
    }
}

stockInfo.prototype.setChipAnalysis = function (type, data = null) {
    switch (type) {
        case "D_TIME":
            this.info.o_ChipAnalysis.a_D_TIME = data;
            break;
        case "D_FIR":
            this.info.o_ChipAnalysis.a_D_FIR = data;
            break;
        case "D_IIR":
            this.info.o_ChipAnalysis.a_D_IIR = data;
            break;
        case "D_NBNS":
            this.info.o_ChipAnalysis.s_D_NBNS = data;
            break;
    }
}

stockInfo.prototype.getChipAnalysis = function (type) {
    switch (type) {
        case "D_TIME":
            return this.info.o_ChipAnalysis.a_D_TIME;
            break;
        case "D_FIR":
            return this.info.o_ChipAnalysis.a_D_FIR;
            break;
        case "D_IIR":
            return this.info.o_ChipAnalysis.a_D_IIR;
            break;
        case "D_NBNS":
            return this.info.o_ChipAnalysis.s_D_NBNS;
            break;
        default:
            return this.info.o_ChipAnalysis;
            break;
    }
}

stockInfo.prototype.getAvergeValue = function (type) {
    let max_range = 10;
    switch (type) {
        case "Price.MA5":
            return getMovingAverage(5, this.info.o_Price.a_D_ClosePrice).slice(0, max_range);
            break;
        case "Price.MA10":
            return getMovingAverage(10, this.info.o_Price.a_D_ClosePrice).slice(0, max_range);
            break;
        case "Price.MA20":
            return getMovingAverage(20, this.info.o_Price.a_D_ClosePrice).slice(0, max_range);
            break;
        case "Price.MA60":
            return getMovingAverage(60, this.info.o_Price.a_D_ClosePrice).slice(0, max_range);
            break;
        case "Volume.MA5":
            return getMovingAverage(5, this.info.o_Price.a_D_Volume).slice(0, max_range);
            break;
        case "Volume.MA10":
            return getMovingAverage(10, this.info.o_Price.a_D_Volume).slice(0, max_range);
            break;
        case "Volume.MA20":
            return getMovingAverage(20, this.info.o_Price.a_D_Volume).slice(0, max_range);
            break;
        case "Volume.MA60":
            return getMovingAverage(60, this.info.o_Price.a_D_Volume).slice(0, max_range);
            break;
    }
}

stockInfo.prototype.setCapital = function (type, data = []){
    switch (type) {
        case "Q_value":
            this.info.o_Capital.a_Q_value = data;
            break;
        case "Q_TIME":
            this.info.o_Capital.a_Q_TIME = data;
            break;
        case "D_Current":
            this.info.o_Capital.s_current = data;
            break;
    }
}
stockInfo.prototype.getCapital = function(type){
    switch (type) {
        case "Q_value":
            return this.info.o_Capital.a_Q_value
            break;
        case "Q_TIME":
            return this.info.o_Capital.a_Q_TIME;
            break;
        case "D_Current":
            return this.info.o_Capital.s_current;
            break;
    }
}
stockInfo.prototype.setPE = function (type, data = []){
    switch (type) {
        case "D_current":
            this.info.o_PE.s_current = data;
            break;
        case "Y_max":
            this.info.o_PE.a_Y_max = data;
            break;
        case "Y_min":
            this.info.o_PE.a_Y_min = data;
            break;
        case "Y_TIME":
            this.info.o_PE.a_Y_TIME = data;
            break;
    }
}
stockInfo.prototype.getPE = function(type){
    switch (type) {
        case "D_current":
            return this.info.o_PE.s_current;
            break;
        case "Y_max":
            return this.info.o_PE.a_Y_max;
            break;
        case "Y_min":
            return this.info.o_PE.a_Y_min;
            break;
        case "Y_TIME":
            return this.info.o_PE.a_Y_TIME;
            break;
    }
}
stockInfo.prototype.setEPS = function (type, data = []){
    switch (type) {
        case "M_value":
            this.info.o_EPS.a_M_value = data;
            break;
        case "Q_value":
            this.info.o_EPS.a_Q_value = data;
            break;
        case "Y_value":
            this.info.o_EPS.a_Y_value = data;
            break;
        case "M_TIME":
            this.info.o_EPS.a_M_TIME = data;
            break;
        case "Q_TIME":
            this.info.o_EPS.a_Q_TIME = data;
            break;
        case "Y_TIME":
            this.info.o_EPS.a_Y_TIME = data;
            break;
    }
}
stockInfo.prototype.getEPS = function(type){
    switch (type) {
        case "M_value":
            return this.info.o_EPS.a_M_value;
            break;
        case "Q_value":
            return this.info.o_EPS.a_Q_value;
            break;
        case "Y_value":
            return this.info.o_EPS.a_Y_value;
            break;
        case "M_TIME":
            return this.info.o_EPS.a_M_TIME;
            break;
        case "Q_TIME":
            return this.info.o_EPS.a_Q_TIME;
            break;
        case "Y_TIME":
            return this.info.o_EPS.a_Y_TIME;
            break;
    }
}
stockInfo.prototype.setOperatingRevenue = function (type, data = []) {
    switch (type) {
        case "M_value":
            this.info.o_OperatingRevenue.a_M_value = data;
            break;
        case "Q_value":
            this.info.o_OperatingRevenue.a_Q_value = data;
            break;
        case "Y_value":
            this.info.o_OperatingRevenue.a_Y_value = data;
            break;
        case "M_MoM":
            this.info.o_OperatingRevenue.a_M_MoM = data;
            break;
        case "M_YoY":
            this.info.o_OperatingRevenue.a_M_YoY = data;
            break;
        case "M_TIME":
            this.info.o_OperatingRevenue.a_M_TIME = data;
            break;
        case "Q_TIME":
            this.info.o_OperatingRevenue.a_Q_TIME = data;
            break;
        case "Y_TIME":
            this.info.o_OperatingRevenue.a_Y_TIME = data;
            break;
    }
};
stockInfo.prototype.getOperatingRevenue = function(type) {
    switch (type) {
        case "M_value":
            return this.info.o_OperatingRevenue.a_M_value;
            break;
        case "Q_value":
            return this.info.o_OperatingRevenue.a_Q_value;
            break;
        case "Y_value":
            return this.info.o_OperatingRevenue.a_Y_value;
            break;
        case "M_MoM":
            return this.info.o_OperatingRevenue.a_M_MoM;
            break;
        case "M_YoY":
            return this.info.o_OperatingRevenue.a_M_YoY;
            break;
        case "M_TIME":
            return this.info.o_OperatingRevenue.a_M_TIME;
            break;
        case "Q_TIME":
            return this.info.o_OperatingRevenue.a_Q_TIME;
            break;
        case "Y_TIME":
            return this.info.o_OperatingRevenue.a_Y_TIME;
            break;
    }
};

stockInfo.prototype.setGrossProfit = function (type, data = []) {
    switch (type) {
        case "Q_value":
            this.info.o_GrossProfit.a_Q_value = data;
            break;
        case "Q_TIME":
            this.info.o_GrossProfit.a_Q_TIME = data;
            break;
    }
};
stockInfo.prototype.getGrossProfit = function (type) {
    switch (type) {
        case "Q_value":
            return this.info.o_GrossProfit.a_Q_value;
            break;
        case "Q_TIME":
            return this.info.o_GrossProfit.a_Q_TIME;
            break;
        default:
            return this.info.o_GrossProfit;
    }
};

stockInfo.prototype.setOperatingProfitMargin = function (type, data = []) {
    switch (type) {
        case "Q_value":
            this.info.o_OperatingProfitMargin.a_Q_value = data;
            break;
        case "Q_TIME":
            this.info.o_OperatingProfitMargin.a_Q_TIME = data;
            break;
    }
};

stockInfo.prototype.getOperatingProfitMargin = function (type) {
    switch (type) {
        case "Q_value":
            return this.info.o_OperatingProfitMargin.a_Q_value;
            break;
        case "Q_TIME":
            return this.info.o_OperatingProfitMargin.a_Q_TIME;
            break;
        default:
            return this.info.o_OperatingProfitMargin;
    }
};

stockInfo.prototype.setOperatingCost = function() {};
stockInfo.prototype.getOperatingCost = function() {};
stockInfo.prototype.setOperatingIncome = function() {};
stockInfo.prototype.getOperatingIncome = function() {};
stockInfo.prototype.getOperatingExpend = function() {};
stockInfo.prototype.setOperatingExpend = function() {};
stockInfo.prototype.setNetIncome = function(type, data =[]) {
    switch (type) {
        case "Q_afterTax":
            this.info.o_NetIncome.a_Q_afterTax = data;
            break;
        case "Q_beforeTax":
            this.info.o_NetIncome.a_Q_beforeTax = data;
            break;
        case "Y_afterTax":
            this.info.o_NetIncome.a_Y_afterTax = data;
            break;
        case "Y_beforeTax":
            this.info.o_NetIncome.a_Y_beforeTax = data;
            break;
        case "Q_TIME":
            this.info.o_NetIncome.a_Q_TIME = data;
            break;
        case "Y_TIME":
            this.info.o_NetIncome.a_Y_TIME = data;
            break;
    }
};
stockInfo.prototype.getNetIncome = function(type) {
    switch (type) {
        case "Q_afterTax":
            return this.info.o_NetIncome.a_Q_afterTax;
            break;
        case "Q_beforeTax":
            return this.info.o_NetIncome.a_Q_beforeTax;
            break;
        case "Y_afterTax":
            return this.info.o_NetIncome.a_Y_afterTax;
            break;
        case "Y_beforeTax":
            return this.info.o_NetIncome.a_Y_beforeTax;
            break;
        case "Q_TIME":
            return this.info.o_NetIncome.a_Q_TIME;
            break;
        case "Y_TIME":
            return this.info.o_NetIncome.a_Y_TIME;
            break;
    }
};


/*---------------------------------*/
/*      Basic Stock Info           */
/*---------------------------------*/
const getEmptySimpleStockInfo = () => ({
    ID: null,
    Name: null,
    Type: null,
    Category: null,
});

stockInfo.prototype.setBasicStockInfo = function (val){
    this.basic = val || getEmptySimpleStockInfo();
}
function simpleStockInfo(val) {
    this.basic = val || getEmptySimpleStockInfo();
}

stockInfo.prototype.setBasicID = function (ID) {
    this.basic.ID = ID;
}

stockInfo.prototype.getBasicID = function () {
    return this.basic.ID;
}

stockInfo.prototype.setBasicName = function (Name) {
    this.basic.Name = Name;
}

stockInfo.prototype.getBasicName = function () {
    return this.basic.Name;
}

stockInfo.prototype.setBasicType = function (Type) {
    this.basic.Type = Type;
}

stockInfo.prototype.getBasicType = function () {
    return this.basic.Type;
}

stockInfo.prototype.setBasicCategory = function (Category) {
    this.basic.Category = Category;
}

stockInfo.prototype.getBasicCategory = function () {
    return this.basic.Category;
}


/*---------------------------------*/
/* toString                        */
/*---------------------------------*/
stockInfo.prototype.toString = function () {
    let { ID, Name, Type, Category } = this.basic;
    let { s_ProductType } = this.info;
    return `${ID},${Name},${Type},${Category},${s_ProductType}`;
};

/*---------------------------------*/
/* Export                          */
/*---------------------------------*/

module.exports.stockInfo = stockInfo;
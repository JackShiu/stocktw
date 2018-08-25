
module.exports.getEmptyStockInfo = getEmptyStockInfo = function () {
    return ({
        s_Name: null,
        s_ProductType: null,
        o_UpdateTime: {
            s_M_TIME: null, //2018-08
            s_Q_TIME: null, //2018-Q1
            s_Y_TIME: null //2018
        },
        o_Price: {
            s_closingPrice: null,
            s_maxInYear: null,
            s_minInYear: null
        },
        o_Capital: {
            a_Q_value: [],
            a_Q_TIME: []
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
    this.info = val || getEmptyStockInfo();
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

stockInfo.prototype.setUpdatedTime = function (type, time = null){
    switch (type) {
            case "M_TIME":
            this.info.o_UpdateTime.s_M_TIME = time;
        break;
            case "Q_TIME":
            this.info.o_UpdateTime.s_Q_TIME = time;
        break;
            case "Y_TIME":
            this.info.o_UpdateTime.s_Y_TIME = time;
        break;
    }
}
stockInfo.prototype.getUpdatedTime = function(type){
    switch (type) {
        case "M_TIME":
            return this.info.o_UpdateTime.s_M_TIME;
            break;
        case "Q_TIME":
            return this.info.o_UpdateTime.s_Q_TIME;
            break;
        case "Y_TIME":
            return this.info.o_UpdateTime.s_Y_TIME;
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
    }
}
stockInfo.prototype.getPrice = function(type){
    switch (type) {
        case "D_closingPrice":
            return this.info.o_Price.s_closingPrice;
            break;
        case "D_maxInYear":
            return this.info.o_Price.s_maxInYear;
            break;
        case "D_minInYear":
            return this.info.o_Price.s_minInYear;
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
/* Export                          */
/*---------------------------------*/

module.exports.stockInfo = stockInfo;
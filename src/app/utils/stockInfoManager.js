import { stockInfo as stockInfoInterfaceManager } from 'interface/stockInfo';
import * as parsedInfo from 'data/all_stock_value.json';
import * as basicInfo from 'data/list.json';
import { calculate } from 'parser/analysis/calculate';

import { getMovingAverage } from "./utils";
import { rankObj } from "./rankList";


class stockInfoManager {
    constructor(){
        this.o_stockKeywordList = [];
        this.o_stockInfo = {};
        this.o_stockEvaluatedInfo = {};
        this.a_rankList = [];
        this.a_idList =[];
        this.stockInfoInitialize();
        this.stockEvaluatedInfoInitialize();
        this.stockCalcRank();
        // console.log(this.o_stockInfo[1477])
        // console.log(this.o_stockInfo[1477].info.getPrice("D_ClosePrice"));
        // console.log(this.o_stockEvaluatedInfo[1477].MA20);
        // console.log(this.o_stockEvaluatedInfo[1477].predictInfo.PredictEPS);
        // this.mModuleManager = new moduleManager();
        // this.mRankManager = new rankManager(this.o_stockInfo);
        // console.log(this.getRankList());
        // console.log(this.getInfobyID(3661));
        // console.log(this.getRankObjNamelist());
    }

    stockInfoInitialize(){
        //create stockInfo Object
        basicInfo.data.forEach(item => {
            let raw = parsedInfo[item.ID];
            let info = new stockInfoInterfaceManager(raw);
            //update Basic info into Object
            info.setBasicStockInfo(item);
            //store in local variable
            this.o_stockInfo[item.ID] = {
                info
            }
            this.o_stockKeywordList.push({
                keywords: info.toString(),
                id : item.ID
            });
            this.a_idList.push(item.ID);
        });
    }

    stockEvaluatedInfoInitialize(){
        Object.keys(this.o_stockInfo).forEach(id => {
            let {info} = this.o_stockInfo[id];
            let predictInfo = calculate(info);
            let MA5 = getMovingAverage(5,info.getPrice("D_ClosePrice"));
            let MA10 = getMovingAverage(10,info.getPrice("D_ClosePrice"));
            let MA20 = getMovingAverage(20,info.getPrice("D_ClosePrice"));
            let Volume_MA5 = getMovingAverage(5, info.getPrice("D_Volume"));
            //store in local variable
            this.o_stockEvaluatedInfo[id] = {
                ... predictInfo,
                MA5,
                MA10,
                MA20,
                Volume_MA5
            };
        })
    }

    stockCalcRank(){
        let compare = (module) => {
            return (a, b) =>module.compare(
                    module.getValue(this.getInfobyID(a)),
                    module.getValue(this.getInfobyID(b))
             )
        }
        rankObj.forEach( module => {
            let name = module.name;
            let idList = this.a_idList
              .slice()
              .sort(compare(module));
            this.a_rankList.push({ name, list:idList });
        });
    }


    getKeywordList(){
        return this.o_stockKeywordList;
    }

    getRankList(id){
        return this.a_rankList.reduce((acc, obj) => {
            let rank = -1
            if (id === undefined) {
                rank =  obj.list;
            } else {
                rank = obj.list.indexOf(id) + 1;
            }
            return Object.assign(acc, { [obj.name]: rank } )
        },{})
    }

    getRankObjNamelist = () => {
        let list = rankObj.map(obj => obj.name);
        return list;
    }

    getInfobyID( id ){
        let rank = this.getRankList(id);
        return { ...this.o_stockInfo[id], ...this.o_stockEvaluatedInfo[id], ...rank };
    }

}


export default stockInfoManager;

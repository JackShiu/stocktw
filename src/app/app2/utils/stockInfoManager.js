import { stockInfo as stockInfoInterfaceManager } from 'interface/stockInfo';
import * as parsedInfo from 'data/all_stock_value.json';
import * as basicInfo from 'data/list.json';
import { calculate } from 'parser/analysis/calculate';

import { getMovingAverage } from "./utils";
import { rankObj } from "./rankList";


class stockInfoManager {
    constructor(){
        // this.o_stockKeywordList = [];
        this.o_stockInfo = {};
        this.o_stockEvaluatedInfo = {};
        this.a_rankList = [];
        this.a_idList =[];
        this.stockInfoInitialize();
        this.stockEvaluatedInfoInitialize();
        this.stockCalcRank();
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
                info,
                keywords: info.toString()
            }
            this.a_idList.push(item.ID);
        });
    }

    stockEvaluatedInfoInitialize(){
        Object.keys(this.o_stockInfo).forEach(id => {
            let {info} = this.o_stockInfo[id];
            let predictInfo = calculate(info);
            let MA5 = info.getAvergeValue("Price.MA5");
            let MA10 = info.getAvergeValue("Price.MA10");
            let MA20 = info.getAvergeValue("Price.MA20");
            let MA60 = info.getAvergeValue("Price.MA60");
            let Volume_MA5 = info.getAvergeValue("Volume.MA5");
            let Volume_MA10 = info.getAvergeValue("Volume.MA10");
            //store in local variable
            // console.log(MA10)
            let sum_of_volume_1 = parseInt(info.getPrice("D_Volume")[0])|| 0;
            let sum_of_volume_5 = info.getPrice("D_Volume")
                                    .slice(0,5)
                                    .reduce((acc,v)=>acc+parseInt(v),0) || 0
            let sum_of_volume_20 = info.getPrice("D_Volume")
                                    .slice(0, 20)
                                    .reduce((acc, v) => acc + parseInt(v),0) || 0
            let sum_of_volume_60 = info.getPrice("D_Volume")
                                    .slice(0, 60)
                                    .reduce((acc, v) => acc + parseInt(v),0) || 0
            let MainforceRate_1 = info.getMainForceVolume('diff_1')/sum_of_volume_1 * 100;
            let MainforceRate_5 = info.getMainForceVolume('diff_5')/sum_of_volume_5 * 100;
            let MainforceRate_20 = info.getMainForceVolume('diff_20')/sum_of_volume_20 * 100;
            let MainforceRate_60 = info.getMainForceVolume('diff_60')/sum_of_volume_60 * 100;
            // console.log(info.getBasicID(), sum_of_volume_1, sum_of_volume_5, sum_of_volume_20, sum_of_volume_60);
            // console.log(info.getBasicID(), MainforceRate_1, MainforceRate_5, MainforceRate_20, MainforceRate_60);

            this.o_stockEvaluatedInfo[id] = {
                ... predictInfo,
                MA5,
                MA10,
                MA20,
                MA60,
                Volume_MA5,
                MainforceRate_1,
                MainforceRate_5,
                MainforceRate_20,
                MainforceRate_60,
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
            let display = module.display;
            let idList = this.a_idList
              .slice()
              .sort(compare(module));
            this.a_rankList.push({ name, list: idList, display });
        });
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
    getRankDisplayNameObjList = () => {
        return this.a_rankList.reduce((acc, obj) => {
            return Object.assign(acc, { [obj.name]: obj.display });
        }, {})
    }

    /*
       Function getInfobyID
       parameters:
        id: stock id
       return:
         stockInfo Object:
            .info : stockInfo
            [avergeValue_tag]: MA5,MA10 ....
            [rank_tag]: R_estimated, R_deltaChange_P
            [evaluate_tag]:
    */
    getInfobyID( id ){
        let rank = this.getRankList(id);
        return { ...this.o_stockInfo[id], ...this.o_stockEvaluatedInfo[id], ...rank };
    }

}


export default stockInfoManager;

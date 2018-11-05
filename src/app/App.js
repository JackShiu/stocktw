import React, { Component } from 'react';
import './App.css';
//import parsed-data info
import { stockInfo as infoManager} from 'interface/stockInfo';
import  * as parseValue from 'data/all_stock_value.json';
import  * as parseList from 'data/list.json';
import { calculate} from 'parser/analysis/calculate';
import * as selectList from 'list.json'
//import componenets
import SideBar from './components/SideBar'
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from "./components/Navbar";
import SectionDelete from "./components/SectionDelete";
import SectionStockList from "./components/SectionStockList";
import ScrollTopBtn from './components/ScrollTopBtn';
import mStockInfoManager from './utils/stockInfoManager'

let getStockInfo = parseList.data.map(req => {
  let stock = parseValue[req.ID];
  let info = new infoManager(stock);
  info.setBasicStockInfo(req);
  // console.log(info);
  let cal = calculate(info);
  let rank = cal.RiskEarningRatio;
  return {
    info,
    conj: info.toString(), //for search
    cal,
    rank
  };
});

class App extends Component {


  constructor() {
    super();
    this.state = {
      stockList: getStockInfo,
      isScroll:false
    }
    let temp = new mStockInfoManager();
    // console.log(temp.getInfobyID(1477));
    // console.log(temp.getRankObjNamelist());
    // console.log(temp.getRankList());
    // console.log(temp.getStockInfo()[1477].keywords)
    // console.log(temp.getEvaluatedInfo()[1477].Volume_MA5);
    // console.log(temp.getEvaluatedInfo()[1477].predictInfo.PredictEPS);
  }

  render() {
    // console.log(this.state.stocklist)
    // console.log(Object.keys(selectList).map(v => `${v} : ${selectList[v]}`));
    return <div className="App">
      <ScrollTopBtn />
      <SideBar />
        <main>
          <Header />
          <Navbar />
          {/* <SectionDelete /> */}
          <SectionStockList stockList={this.state.stockList} />
        </main>
        <Footer />
      </div>;
  }



}


export default App;

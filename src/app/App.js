import React, { Component } from 'react';
import './App.css';
//import parsed-data info
import { stockInfo as infoManager} from 'interface/stockInfo';
import  * as parseValue from 'data/all_stock_value.json';
import  * as parseList from 'data/list.json';
import { calculate} from 'parser/analysis/calculate';

//import componenets
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from "./components/Navbar";
import SectionDelete from "./components/SectionDelete";
import SectionStockList from "./components/SectionStockList";

let getStockInfo = parseList.data.map(req => {
  let stock = parseValue[req.ID];
  let info = new infoManager(stock);
  info.setBasicStockInfo(req);
  // console.log(info);
  let cal = calculate(info);
  let rank = cal.RiskEarningRatio;
  return {
    info,
    cal,
    rank
  };
});

class App extends Component {


  constructor() {
    super();
    this.state = {
      stockList: getStockInfo
    }
  }

  render() {
    // console.log(this.state.stocklist)
    return <div className="App">
        <main>
          <Header />
          <Navbar />
          <SectionDelete />
          <SectionStockList stockList={this.state.stockList} />
        </main>
        <Footer />
      </div>;
  }



}


export default App;

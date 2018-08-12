import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';
import { stockInfo as stockInfoType} from 'interface/stockInfo';
import  * as stockData from 'data/all_stock_value.json';
import  * as stockList from 'data/list.json';

import { calculate} from 'parser/analysis/calculate';
import StyledHeader from 'app/Header.js'
import StyledStockList from 'app/StockList'
// import 
const textcolor0 = "#000000";
const grey5  = "#555555";
const grey6  = "#666666";
const grey7  = "#777777";
const grey8  = "#888888";
const grey9  = "#999999";
const greya  = "#aaaaaa";
const greyb  = "#bbbbbb";
const greyc  = "#cccccc";
const greyd  = "#dddddd";
const greye  = "#eeeeee";
const greyf  = "#ffffff";



const Footer = styled.footer`
  background-color: ${greya}
`;


class App extends Component {
  constructor(){
      super();
  }

  render() {
    return (
      <div className="App">
        <StyledHeader>
           <h1>StockTW</h1>
           <div className="search-form">
            <input  type="text"  placeholder="searching ..." />
            <input  type="button" value="Search" />
           </div>
        </StyledHeader>
        <StyledStockList stockList={getStockInfo.sort((a, b) => b.rank - a.rank).slice(0,20)}/>
        <Footer>this is footer</Footer>
      </div>
    )
  }
}


// class Header extends Component {
//   render(){
//      return (
//        <div>
//          <input />
//          {/* input / */}
//        </div>
//      )
//   }
// }

// class App extends Component {
//   constructor(props){
//       super(props);
//   }

//   render() {
//     return (
//       <div className="App">
//           <header id="header">
//             <h1 id="header-title">stocktw</h1>
//           </header>
//           <section id="stock-list">
//           {getStockInfo.sort((a, b) => b.rank - a.rank).map(req => stockInfoDisplay(req))}
//           </section>
//           <footer id="footer">
//            <span>STOCKTW</span> <span>Power by <b>jackShiu</b></span>
//           </footer>
//       </div>
//     )
//   }
// }



let getStockInfo = stockList.data.map(req => {
  let stock= stockData[req.ID];
  let info= new stockInfoType(stock);
  let cal= calculate(info);
  let rank= cal.RiskEarningRatio;
  return (
    {
      req,
      info,
      cal,
      rank
    }
  )
});


let checkValue = num => {
  if (isNaN(num) || num.length === 0)
    return num;
  let tmp = num;
  if(num % 1 !==0){
    tmp = num.toFixed(2);
  }
  if (tmp === -1) {
    return (<span style={{color:"red"}}>{tmp}</span>);
  }
  return tmp
}

let stockInfoDisplay = ({ req:basic, cal, info}) => {

  const { ID, Name, Type, Category } = basic;
  const { PredictPE,
    predictProfitMonthYoY,
    PredictedEarning,
    PredictProfitRatio,
    PredictEPS,
    PredictHighestPrice,
    PredictLowestPrice,
    PredictEarningRatio,
    RiskEarningRatio,
    PEG
  } = cal;
  // const { getProductType, getPrice } = info;

  return (
  <div key={ID} className="stock-item">
    <div className="stock-item__head clearfix">
      <div className="width_10"><span>{ID}</span></div>
      <div className="width_40"><span>{Name}</span></div>
      <div className="width_10"><span>{Type}</span></div>
      <div className="width_40"><span>{Category}</span></div>
    </div>
    <div className="stock-item__description">
      <span>{info.getProductType()}</span>
    </div>
    <div className="stock-item__info">
      <li>收盤價: <span className="data">{checkValue(info.getPrice('D_closingPrice'))}</span> (元)</li>
      <li>預估本益比: <span className="data">{checkValue(PredictPE[0])}</span>~<span className="data">{checkValue(PredictPE[1])}</span></li>
      <li>預估營收年增率: <span className="data">{checkValue(predictProfitMonthYoY)}</span> (%)</li>
      <li>預估營收: <span className="data">{checkValue(PredictedEarning)}</span> (百萬)</li>
      <li>預估稅後淨利率: <span className="data">{checkValue(PredictProfitRatio * 100)}</span> (%)</li>
      <li>預估EPS: <span className="data">{checkValue(PredictEPS)}</span> (元)</li>
      <li>預估股價高低落點: <span className="data">{checkValue(PredictHighestPrice)}</span>~<span className="data">{checkValue(PredictLowestPrice)}</span></li>
      <li>預估報酬率: <span className="data">{checkValue(PredictEarningRatio)}</span></li>
      <li>預估風險: <span className="data">{checkValue(RiskEarningRatio)}</span></li>
      <li>風險報酬倍數: <span className="data">{checkValue(PEG)}</span></li>
    </div>
  </div>
)}


export default App;

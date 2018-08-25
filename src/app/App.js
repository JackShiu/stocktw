import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';
import { stockInfo as stockInfoType} from 'interface/stockInfo';
import  * as stockData from 'data/all_stock_value.json';
import  * as stockList from 'data/list.json';

import { calculate} from 'parser/analysis/calculate';
import StyledHeader from 'app/Header.js'
import StyledStockList from 'app/StockList'
import * as color from "app/color";



const Footer = styled.footer`
  background-color: ${color.greya}
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


let getStockInfo = stockList.data.map(req => {
  let stock= stockData[req.ID];
  let info= new stockInfoType(stock);
  info.setBasicStockInfo(req);
  console.log(info)
  let cal= calculate(info);
  let rank= cal.RiskEarningRatio;
  return (
    {
      info,
      cal,
      rank
    }
  )
});



export default App;

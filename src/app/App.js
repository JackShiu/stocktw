import React, { Component } from 'react';
import './App.css';
import { stockInfo as stockInfoType} from 'interface/stockInfo';
import  * as stockData from 'data/all_stock_value.json';
import  * as stockList from 'data/list.json';



import { calculate} from 'parser/analysis/calculate'
class App extends Component {
  constructor(props){
      super(props);

  }

  render() {
    return (
      <div className="App">
          <header id="header">
            <h1 id="header-title">stocktw</h1>
          </header>
          <section id="stock-list">
          {getStockInfo.sort((a, b) => b.rank - a.rank).map(req => stockInfoDisplay(req))}
          </section>
          <footer id="footer">
           <span>STOCKTW</span> <span>Power by <b>jackShiu</b></span>
          </footer>
      </div>
    )
  }
}
//.sort((a, b) => b.rank - a.rank)
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

let stockInfoDisplay = ({ req, cal, info}) => (
    <div key={req.ID} className="stock-item">
      <div className="stock-item__head clearfix">
        <div className="width_10">{req.ID}</div>
        <div className="width_40">{req.Name}</div>
        <div className="width_10">{req.Type}</div>
        <div className="width_40">{req.Category}</div>
      </div>
      <div className="stock-item__description">
        {info.getProductType()}
      </div>
      <div className="stock-item__info">
        <li>收盤價: {info.getStockName()} (元)</li>
        <li>預估本益比: {cal.PredictPE[0]}~{cal.PredictPE[1]}</li>
        <li>預估營收年增率: {cal.predictProfitMonthYoY} (%)</li>
        <li>預估營收: {cal.PredictedEarning} (百萬)</li>
        <li>預估稅後淨利率: {cal.PredictProfitRatio * 100} (%)</li>
        <li>預估EPS: {cal.PredictEPS} (元)</li>
        <li>預估股價高低落點: {cal.PredictHighestPrice}~{cal.PredictLowestPrice}</li>
        <li>預估報酬率: {cal.PredictEarningRatio}</li>
        <li>預估風險: {cal.RiskEarningRatio}</li>
        <li>風險報酬倍數: {cal.PEG}</li>
      </div>
    </div>
)

export default App;

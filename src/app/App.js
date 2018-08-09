import React, { Component } from 'react';
import './App.css';
import { stockInfo} from 'interface/stockInfo';
import  * as stockData from 'data/all_stock_value.json';
import  * as stockList from 'data/list.json';
import { calculate} from 'parser/analysis/calculate'
class App extends Component {
  constructor(props){
      super(props);

  }


  render() {
    // console.log(alldata);
    let display = stockList.data.map(req => {
      let stock = stockData[req.ID];
      let info = new stockInfo(stock);
      // console.log(calculate(info).RiskEarningRatio);
        let stylesContainer = {
          width: '800px',
          margin: '0 auto',
          // backgroundColor: '#8CC152'
        }
      let stylesItem = {
        display: "inline-block",
        width: '100px',
        marginRight: '20px',
        backgroundColor: '#aaaa'
      };
      let getDisplay = (stockID = "NULL", info = {}, cal = {}) =>
      <div>
      <div>=======[${stockID}]========</div>
      <div>股票：${info.getStockName()}</div>
      <div>營收比重：${info.getProductType()}</div>
      <div>收盤價: ${info.getPrice('D_closingPrice')} (元)</div>
      <div>預估本益比: ${cal.PredictPE[0].toFixed(2)}~${cal.PredictPE[1].toFixed(2)}</div>
      <div>過去本益比區間(年): 高:[${info.getPE("Y_max").slice(0, 6)}] 低:[${info.getPE("Y_min").slice(0, 6)}]</div>
      <div>預估營收年增率: ${cal.predictProfitMonthYoY.toFixed(2)} (%)</div>
      <div>  (過去六個月 [${info.getOperatingRevenue('M_YoY').slice(0, 5)}])</div>
      <div>預估營收: ${cal.PredictedEarning.toFixed(2)} (百萬)</div>
      <div>預估稅後淨利率: ${(cal.PredictProfitRatio * 100).toFixed(2)} (%)</div>
      <div>預估EPS: ${cal.PredictEPS.toFixed(2)} (元) (過去兩年PES=[${info.getEPS('Y_value').slice(0, 2)}])</div>
      <div>預估股價高低落點: ${cal.PredictHighestPrice.toFixed(2)}~${cal.PredictLowestPrice.toFixed(2)} ,(當前:${info.getPrice('D_closingPrice')})</div>
      <div>預估報酬率: ${cal.PredictEarningRatio.toFixed(2)}</div>
      <div>預估風險: ${cal.PredictLossRatio.toFixed(2)}</div>
      <div>風險報酬倍數: ${cal.RiskEarningRatio.toFixed(2)}</div>
      <div>PEG : ${cal.PEG.toFixed(3)}\n</div>
      </div>;
      return (
        <div key={req.ID} style={stylesContainer}>
          <div className="item-header" >
            <span style={stylesItem}>{req.ID}</span>
            <span style={stylesItem}>{req.Name}</span>
            <span style={stylesItem}>{req.Type}</span>
            <span>{req.Category}</span>
          </div>
          <div className="item-content">
            {getDisplay(req.ID, info, calculate(info))}
          </div>
        </div>
      )
    });
    return <div className="App">
        <div>
          <h1>Header</h1>
        </div>
      <div>
          {display}
        </div>
      </div>
  }
}



export default App;

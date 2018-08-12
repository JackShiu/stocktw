import React, { Component } from 'react';
import styled from 'styled-components';

const textcolor0 = "#000000";
const grey5 = "#555555";
const grey6 = "#666666";
const grey7 = "#777777";
const grey8 = "#888888";
const grey9 = "#999999";
const greya = "#aaaaaa";
const greyb = "#bbbbbb";
const greyc = "#cccccc";
const greyd = "#dddddd";
const greye = "#eeeeee";
const greyf = "#ffffff";


let checkValue = num => {
    if (isNaN(num) || num.length === 0)
        return num;
    let tmp = num;
    if (num % 1 !== 0) {
        tmp = num.toFixed(2);
    }
    if (tmp === -1) {
        return (<span style={{ color: "red" }}>{tmp}</span>);
    }
    return tmp
}

let stockInfoDisplay = ({index, req: basic, cal, info }) => {

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
            <span>
                rank:{index}
            </span>
            <span>
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

            </span>
        </div>
    )
}

class StockInfo extends Component {
    render() {
        const { children, className, stock } = this.props;

        return (
            <div className={className}>
                {stockInfoDisplay(stock)}
            </div>
        )
    }
}

const StyledStockInfo = styled(StockInfo)`
    background-color:${greyb};
    width:700px;
    padding: 20px;
    margin: 0 auto 30px auto;

`
export default StyledStockInfo;

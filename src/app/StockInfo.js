import React, { Component } from 'react';
import styled from 'styled-components';
import * as color from "app/color";


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

let calInfoList = (cal = {}, info = {}) => ([
    {
        prefix: "收盤價",
        value: info.getPrice('D_closingPrice'),
        suffix: "(元)"
    },
    {
        prefix: "預估本益比",
        value: cal.PredictPE,
        suffix: ""
    },
    {
        prefix: "預估營收年增率",
        value: cal.predictProfitMonthYoY,
        suffix: "(%)"
    },
    {
        prefix: "預估營收",
        value: cal.PredictedEarning,
        suffix: "(百萬)"
    },
    {
        prefix: "預估稅後淨利率",
        value: cal.PredictProfitRatio * 100,
        suffix: "(%)"
    },
    {
        prefix: "預估EPS",
        value: cal.PredictEPS,
        suffix: "(元))"
    },
    {
        prefix: "預估股價高低落點",
        value: [cal.PredictHighestPrice, cal.PredictLowestPrice],
        suffix: ""
    },
    {
        prefix: "預估報酬率",
        value: cal.PredictEarningRatio,
        suffix: "(%)"
    },
    {
        prefix: "預估風險",
        value: cal.RiskEarningRatio,
        suffix: ""
    },
    {
        prefix: "風險報酬倍數",
        value: cal.PEG,
        suffix: ""
    },
])

let stockInfoDisplay = ({index, cal, info }) => {

    // const { ID, Name, Type, Category } = basic;
    // const { PredictPE,
    //     predictProfitMonthYoY,
    //     PredictedEarning,
    //     PredictProfitRatio,
    //     PredictEPS,
    //     PredictHighestPrice,
    //     PredictLowestPrice,
    //     PredictEarningRatio,
    //     RiskEarningRatio,
    //     PEG
    // } = cal;
    // const { getProductType, getPrice } = info;


    return (
        <div key={index} className="stock-item">
            <span>
                rank:{index}
            </span>
            <span>
                <div className="stock-item__head clearfix">
                    <div className="width_10"><span>{info.getBasicID()}</span></div>
                    <div className="width_40"><span>{info.getBasicName()}</span></div>
                    <div className="width_10"><span>{info.getBasicType()}</span></div>
                    <div className="width_40"><span>{info.getBasicCategory()}</span></div>
                </div>
                <div className="stock-item__description">
                    <span>{info.getProductType()}</span>
                </div>
                <div className="stock-item__info">
                    {/* <li>收盤價: <span className="data">{checkValue(info.getPrice('D_closingPrice'))}</span> (元)</li>
                    <li>預估本益比: <span className="data">{checkValue(PredictPE[0])}</span>~<span className="data">{checkValue(PredictPE[1])}</span></li>
                    <li>預估營收年增率: <span className="data">{checkValue(predictProfitMonthYoY)}</span> (%)</li>
                    <li>預估營收: <span className="data">{checkValue(PredictedEarning)}</span> (百萬)</li>
                    <li>預估稅後淨利率: <span className="data">{checkValue(PredictProfitRatio * 100)}</span> (%)</li>
                    <li>預估EPS: <span className="data">{checkValue(PredictEPS)}</span> (元)</li>
                    <li>預估股價高低落點: <span className="data">{checkValue(PredictHighestPrice)}</span>~<span className="data">{checkValue(PredictLowestPrice)}</span></li>
                    <li>預估報酬率: <span className="data">{checkValue(PredictEarningRatio)}</span></li>
                    <li>預估風險: <span className="data">{checkValue(RiskEarningRatio)}</span></li>
                    <li>風險報酬倍數: <span className="data">{checkValue(PEG)}</span></li> */}
                    {calInfoList(cal,info).map((val)=>{
                        return(<li>
                            {val.prefix}:
                            <span className="data">{checkValue(val.value)}</span>
                            {val.suffix}
                        </li>)
                    })}
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
    background-color:${color.greyb};
    width:700px;
    padding: 20px;
    margin: 0 auto 30px auto;

`
export default StyledStockInfo;

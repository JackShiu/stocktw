import React, { Component } from "react";
import "./StockInfo.css";
import PropTypes from 'prop-types';

import { connect } from "react-redux";
import * as actionCreators from "../actions/action";


let checkValue = num => {
    // if (isNaN(num) || num.length === 0) return num;
    if(typeof num === 'string') return num;
    if (isNaN(num)) {
        return -1;
    }
    let tmp = num;
    if (num % 1 !== 0) {
        tmp = num.toFixed(2);
    }
    if (tmp === -1) {
        return <span style={{ color: "red" }}>{tmp}</span>;
    }
    return tmp;
};

let mapToCalObj = (cal = {}, info = {}) => [
    {
        prefix: "收盤價",
        value: info.getPrice("D_closingPrice"),
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
        valueJoint: '~',
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
    }
];

let showRank = ({ index, info } = -1, onAddBtnClick) => {
    return (
        <div className="card-rank">
            <div className="card-rank__btn">
                {/* <i className="btn card-btn__delete"></i> */}
                <i className="btn card-btn__add" onClick={() => onAddBtnClick()} ></i>
                {/* <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNMzQ2LjUgMjQwSDI3MnYtNzQuNWMwLTguOC03LjItMTYtMTYtMTZzLTE2IDcuMi0xNiAxNlYyNDBoLTc0LjVjLTguOCAwLTE2IDYtMTYgMTZzNy41IDE2IDE2IDE2SDI0MHY3NC41YzAgOS41IDcgMTYgMTYgMTZzMTYtNy4yIDE2LTE2VjI3Mmg3NC41YzguOCAwIDE2LTcuMiAxNi0xNnMtNy4yLTE2LTE2LTE2eiIvPjxwYXRoIGQ9Ik0yNTYgNzZjNDguMSAwIDkzLjMgMTguNyAxMjcuMyA1Mi43UzQzNiAyMDcuOSA0MzYgMjU2cy0xOC43IDkzLjMtNTIuNyAxMjcuM1MzMDQuMSA0MzYgMjU2IDQzNmMtNDguMSAwLTkzLjMtMTguNy0xMjcuMy01Mi43Uzc2IDMwNC4xIDc2IDI1NnMxOC43LTkzLjMgNTIuNy0xMjcuM1MyMDcuOSA3NiAyNTYgNzZtMC0yOEMxNDEuMSA0OCA0OCAxNDEuMSA0OCAyNTZzOTMuMSAyMDggMjA4IDIwOCAyMDgtOTMuMSAyMDgtMjA4UzM3MC45IDQ4IDI1NiA0OHoiLz48L3N2Zz4="/> */}
            </div>
            <p>Rank {index}</p>
        </div>
    )
}

let showTitle = ({ info }) => {
    return (
        <div className="stock-title">
            <p className="stock-title__id">{info.getBasicID()}</p>
            <p className="stock-title__name">{info.getBasicName()}</p>
            <p className="stock-title__type">{info.getBasicType()}</p>
            <p className="stock-title__category">{info.getBasicCategory()}</p>
        </div>
    )
}

let showDescription = ({ info }) => {
    return (
        <div className="stock-description">
            {info.getProductType()}
        </div>
    )
}

let showCalInfo = ({ cal, info }) => {
    return (
        <div className="stock-calc">
            <ul>
                {mapToCalObj(cal, info).map((val, i) => {
                    return (<li key={i}>
                        {val.prefix}:
                        <span className="info-value">
                            {
                                val.value instanceof Array ?
                                  val.value.map( tmp =>checkValue(tmp))
                                //   .join(val.valueJoint)
                                  .reduce((acc, cur,i, array)=>{
                                      if (i !== 0 ) {
                                          let comma = val.valueJoint || ',';
                                          return [...acc, comma ,cur]
                                      }
                                      return [...acc,cur]
                                  },[])
                                  : checkValue(val.value)
                            }
                        </span>
                        {val.suffix}
                    </li>)
                })}
            </ul>
        </div>

    )
}
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let mapToTr = (val, key) => (
    <tr key={key}
        className={
            val && val.type === 'date' ?
                'table-time' : 'table-value' }>
        {
            val && val.data && val.data.slice(0, 8)
            .map( (data, i) =>
                <td key={i} >
                    {val.type !== 'date' ? numberWithCommas(data) : data}
                    {val.suffix}
                </td>
            )
        }
    </tr>
)

let mapToTable = (val) => (
    <table>
        <tbody>
            {val.map( (item, i) => (
                mapToTr(item, i)
            ))}
        </tbody>
    </table>
)

let showParseInfo = ({info}) => {
    let capitalInfo = [
        {type: 'date',data: info.getCapital('Q_TIME')},
        {type: 'data', data: info.getCapital('Q_value')}
    ]
    let PEInfo = [
        {type: 'date',data: info.getPE('Y_TIME')},
        {type: 'data',data: info.getPE('Y_max')},
        {type: 'data',data: info.getPE('Y_min')}
    ]
    let EPSInfo = [
        {type: 'date',data: info.getEPS('Y_TIME')},
        {type: 'data',data: info.getEPS('Y_value')},
        {type: 'date',data: info.getEPS('Q_TIME')},
        {type: 'data',data: info.getEPS('Q_value')}
    ]
    let ORevInfo = [
        {type: 'date',data: info.getOperatingRevenue('Y_TIME')},
        {type: 'data',data: info.getOperatingRevenue('Y_value')},
        {type: 'date',data: info.getOperatingRevenue('Q_TIME')},
        {type: 'data',data: info.getOperatingRevenue('Q_value')},
        {type: 'date',data: info.getOperatingRevenue('M_TIME')},
        {type: 'data',data: info.getOperatingRevenue('M_value')},
        {type: 'data',data: info.getOperatingRevenue('M_YoY'),suffix: '%'}
    ]
    return <div className="parse-value">
        <ul>
            <li>
                <div className="table-title">資本額(Capital) (千股)</div>
                {mapToTable(capitalInfo)}
            </li>
            <li>
                <div className="table-title" >本益比(PE) (目前:<span>{info.getPE('D_current')})</span></div>
                {mapToTable(PEInfo)}
            </li>
            <li>
                <div className="table-title" >每股盈利(EPS)</div>
                {mapToTable(EPSInfo)}
            </li>
            <li>
                <div className="table-title" >營業收入(OperatingRevenue)(百萬/千元))</div>
                {mapToTable(ORevInfo)}
            </li>
        </ul>
      </div>;
}

let showLink = ( {info}) => {
    const ID = info.getBasicID();
    return (<div className="show-link">
            <a target="_blank" href={`http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_${ID}.djhtm`}>基本資料</a>
            <a target="_blank" href={`https://www.stockdog.com.tw/stockdog/index.php?sid=${ID}`}>股狗</a>
            <a target="_blank" href={`https://histock.tw/stock/tchart.aspx?no=${ID}`}>K線圖</a>
            <a target="_blank" href={`https://www.cnyes.com/twstock/foreignrating/${ID}.htm`}>外資評等</a>
            <a target="_blank" href={`http://jsjustweb.jihsun.com.tw/z/zc/zcr/zcr0.djhtm?b=Q&a=${ID}`}>財務比率表</a>
            <a target="_blank" href={`https://histock.tw/stock/chips.aspx?no=${ID}&m=mg`}>融資融券</a>
            <a target="_blank" href={`https://histock.tw/stock/${ID}`}>hiStock</a>
            <a target="_blank" href={`https://goodinfo.tw/StockInfo/StockDividendPolicy.asp?STOCK_ID=${ID}&MAP_YEAR=DIVIDEND_YEAR&SHOW_ROTC=`}>股利資訊</a>
            <a target="_blank" href={`https://www.cmoney.tw/follow/channel/stock-${ID}`}>CMoney</a>
    </div>)
};

class StockInfo extends Component {
    static propTypes = {
        stock: PropTypes.object
    }
    static defaultProps = {
        stock: {}
    };

    onAddBtnClick(){
        const { info } = this.props.stock;
        console.log('click: ' + info.getBasicID());
        let id = info.getBasicID();
        let name = info.getBasicName();
        this.props.onAddToList &&
            this.props.onAddToList(id, name);
    }
    render() {
        const { stock } = this.props;
        return <section className="section-sotckinfo">
            <div className="stock-card" >
                {showRank(stock, this.onAddBtnClick.bind(this))}
                <div className="row">
                    <div className="col-4-of-10">
                        {stock && showTitle(stock)}
                        {stock && showDescription(stock)}
                        {stock && showCalInfo(stock)}
                    </div>
                    <div className="col-6-of-10">
                        {stock && showLink(stock)}
                        {stock && showParseInfo(stock)}
                    </div>
                </div>
            </div>
        </section>
    }

}

export default connect(null, actionCreators)(StockInfo);

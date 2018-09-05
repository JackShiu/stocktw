import React, { Component } from "react";
import "./StockInfo.css";

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

let showRank = ({ index } = -1) => {
    return (
        <div className="card-rank">
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
                                          return [ ...acc, val.valueJoint ,cur]
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

class StockInfo extends Component {

    render() {
        const { stock } = this.props;
        return <section className="section-sotckinfo">
            <div className="stock-card" >
                {showRank(stock)}
                <div className="row">
                    <div className="col-4-of-10">
                        {stock && showTitle(stock)}
                        {stock && showDescription(stock)}
                        {stock && showCalInfo(stock)}
                    </div>
                    <div className="col-6-of-10">
                        {stock && showParseInfo(stock)}
                    </div>
                </div>
            </div>
        </section>
    }

}

export default StockInfo;

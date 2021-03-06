import React from "react";
import { ButtonToolbar, Button } from "react-bootstrap";


export let displayList = {
    排序: [
        {
            name: "排序",
            getValue: info => {}
        }
    ],
    基本資料: [
        {
            name: "號碼",
            getValue: info => info.info.getBasicID()
        },
        {
            name: "股票",
            getValue: info => info.info.getBasicName()
        },
        // {
        //     name: "類別",
        //     getValue: info => info.info.getBasicType()
        // },
        // {
        //     name: "族群",
        //     getValue: info => info.info.getBasicCategory()
        // },
        {
            name: (<div><div>股本</div>(億)</div>),
            getValue: info => info.info.getCapital("D_Current")
        },
        {
            name: "收盤價",
            getValue: info => {
                let cP = info.info.getPrice("D_closingPrice");
                let dP = info.info.getPrice("D_dailyPricing")
                // let openP = info.info.getPrice("D_OpenPrice");
                let mColor;
                let limitColor;
                let comma = '';
                let changeLimit = (dP / (cP - dP)) * 100;//漲幅
                // console.log(changeLimit)
                let limit = 9.7
                if (dP > 0) {
                    if (changeLimit > limit)
                        limitColor = 'red';
                    mColor = 'red';
                    comma = '+';
                } else if (dP < 0) {
                    if (changeLimit < -1 * limit)
                        limitColor = "green";
                    mColor = 'green'
                    comma = '';
                }

                let dPp = <p style={{ color: mColor }}>{comma}{changeLimit.toFixed(2)}%</p>
                return <div>
                    <div style={{ backgroundColor: limitColor }}>{cP}</div>
                    <div>{dPp}</div>
                </div>
            }
        },
        {
            name: "成交量",
            getValue: info => {
                let volume = info.info.getPrice("D_Volume");
                if(volume.length >0)
                    return volume[0]
                return 0 ;
            }
        }
    ],
    估算: [
        // {
        //     name: "排名",
        //     getValue: info => info.R_estimated
        // },
        {
            name: "預估EPS",
            getValue: info => {
                let value = info.PredictEPS.toFixed(2);
                return value > 0 ? value : "=";
            }
        },
        {
            name: "預估股價",
            getValue: info => {
                let L = info.PredictLowestPrice.toFixed(2);
                let H = info.PredictHighestPrice.toFixed(2);
                if (L < 0 && H < 0) {
                    return "=";
                } else {
                    return (<div><div>{L}</div><div>{H}</div></div>);
                }
            }
        },
        {
            name: "預估報酬",
            getValue: info => {
                let V = info.PredictEarningRatio.toFixed(2);
                if (V != -1) {
                    return V;
                } else {
                    return "=";
                }
            }
        }
    ],
    籌碼面: [
        {
            name: (
                <div>
                    <p>法人(總.1.3.5)(日差比)</p>
                </div>),
            getValue: info => {
                let data = info.info.getChipAnalysis("D_IIR");
                let diff_1 = -1;
                let diff_3 = -1;
                let diff_5 = -1;
                if (data.length > 0) {
                    diff_1 = (data[0] - data[1]).toFixed(2)
                    diff_3 = (data[0] - data[2]).toFixed(2)
                    diff_5 = (data[0] - data[4]).toFixed(2)
                }
                const getColor = (value) => {
                    if(value > 1) {
                        return {backgroundColor:'red'};
                    } else if(value > 0) {
                        return {color:'red'};
                    } else if (value < -1) {
                        return { backgroundColor: 'green' };
                    } else if(value <0) {
                        return {color:'green'};
                    }
                    return {};
                }
                return <div>
                        <div style={{backgroundColor:'yellow'}}>{data[0]}% (總)</div>
                        <div style={getColor(diff_1)}>{diff_1}%</div>
                        <div style={getColor(diff_3)}>{diff_3}%</div>
                        <div style={getColor(diff_5)}>{diff_5}%</div>
                    </div>
            },
        },
        {
            name: (
                <div>
                    <p>外資(總.1.3.5)(日差比)</p>
                </div>),
            getValue: info => {
                let data = info.info.getChipAnalysis("D_FIR");
                let diff_1 = -1;
                let diff_3 = -1;
                let diff_5 = -1;
                if (data.length > 0) {
                    diff_1 = (data[0] - data[1]).toFixed(2)
                    diff_3 = (data[0] - data[2]).toFixed(2)
                    diff_5 = (data[0] - data[4]).toFixed(2)
                }
                const getColor = (value) => {
                    if (value > 1) {
                        return { backgroundColor: 'red' };
                    } else if (value > 0) {
                        return { color: 'red' };
                    } else if (value < -1) {
                        return { backgroundColor: 'green' };
                    } else if (value < 0) {
                        return { color: 'green' };
                    }
                    return {};
                }
                return <div>
                        <div style={{backgroundColor:'yellow'}}>{data[0]}% (總)</div>
                        <div style={getColor(diff_1)}>{diff_1}%</div>
                        <div style={getColor(diff_3)}>{diff_3}%</div>
                        <div style={getColor(diff_5)}>{diff_5}%</div>
                    </div>
            },
        },
    ],
    // 大戶籌碼: [
    //     {
    //         name: (
    //             <div>
    //                 <p>籌碼集中度</p>
    //                 <p>(1.5.20.60)(日)</p>
    //             </div>),
    //         getValue: info => {
    //             let diff_1 = info.MainforceRate_1.toFixed(2) || 0;
    //             let diff_5 = info.MainforceRate_5.toFixed(2) || 0;
    //             let diff_20 = info.MainforceRate_20.toFixed(2) || 0;
    //             let diff_60 = info.MainforceRate_60.toFixed(2) || 0;
    //             const getColor = (value) => {
    //                 if (value > 15) {
    //                     return { backgroundColor: 'red' };
    //                 } else if (value > 0) {
    //                     return { color: 'red' };
    //                 } else if (value < -15) {
    //                     return { backgroundColor: 'green' };
    //                 } else if (value < 0) {
    //                     return { color: 'green' };
    //                 }
    //                 return {};
    //             }
    //             return <div>
    //                 <div style={getColor(diff_1)}>{diff_1}%</div>
    //                 <div style={getColor(diff_5)}>{diff_5}%</div>
    //                 <div style={getColor(diff_20)}>{diff_20}%</div>
    //                 <div style={getColor(diff_60)}>{diff_60}%</div>
    //             </div>
    //         },
    //     },
    // //   {
    // //     name: "1MA",
    // //     getValue: info => info.MainforceRate_1.toFixed(2)
    // //   },
    // //   {
    // //     name: "5MA",
    // //     getValue: info => info.MainforceRate_5.toFixed(2)
    // //   },
    // //   {
    // //     name: "20MA",
    // //     getValue: info => info.MainforceRate_20.toFixed(2)
    // //   },
    // //   {
    // //     name: "60MA",
    // //     getValue: info => info.MainforceRate_60.toFixed(2)
    // //   }
    // ],
    股利: [
        // {
        //     name: "排名",
        //     getValue: info => info.R_dividend
        // },
        {
            name: "股利",
            getValue: info =>
                info.info.getFundamentalAnalysis("S_dividend").toFixed(2)
        },
        {
            name: "殖利率",
            getValue: info => info.info.getFundamentalAnalysis("S_dividendYield")
        }
    ]
};





/*
    Button Method
*/
/* get button group */
export let getButtonGroup = (id, list) => (
    <ButtonToolbar style={{ marginBottom: '1rem',borderBottom: '1px solid #aaa', paddingBottom: '.5rem' }}>
        {list.map((info, index) => (
            <Button
                // bsSize="small"
                key={index}
                bsStyle={"info"}
                href={info.getLink(id)}
                target={"_blank"}
            // style={{marginLeft:'1rem'}}
            >
                {info.name}
            </Button>
        ))}
    </ButtonToolbar>
);
/*
    Button List
*/
export let btnList = [
    {
        name: "基本資料",
        getLink: id => `http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_${id}.djhtm`
    },
    {
        name: "財務比率表(基本)",
        getLink: id => `http://jsjustweb.jihsun.com.tw/z/zc/zcr/zcr0.djhtm?b=Q&a=${id}`
    },
    {
        name: "K線圖",
        getLink: id => `https://histock.tw/stock/tchart.aspx?no=${id}`
    },
    {
        name: "神秘金字塔",
        getLink: id => `https://norway.twsthr.info/StockHolders.aspx?stock=${id}`
    },
    {
        name: "股狗",
        getLink: id => `https://www.stockdog.com.tw/stockdog/index.php?sid=${id}`
    },
    {
        name: "HiStock",
        getLink: id => `https://histock.tw/stock/${id}`
    },
    {
        name: "CMoney",
        getLink: id => `https://www.cmoney.tw/follow/channel/stock-${id}`
    },
    {
        name: "財報狗",
        getLink: id => `https://statementdog.com/analysis/tpe/${id}`
    },


];
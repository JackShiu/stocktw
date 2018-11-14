import React, { Component } from 'react';
import {
  Button,
  Jumbotron,
  Row,
  Col,
  Grid,
  Table,
  ButtonToolbar,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  // FieldGroup
} from "react-bootstrap";

import mStockInfoManager from "./utils/stockInfoManager";



let mlist = {
  基本資料: [
    {
      name: "號碼",
      getValue: info => info.info.getBasicID()
    },
    {
      name: "股票",
      getValue: info => info.info.getBasicName()
    },
    {
      name: "類別",
      getValue: info => info.info.getBasicType()
    },
    {
      name: "族群",
      getValue: info => info.info.getBasicCategory()
    },
    {
      name: (<p><div>股本</div>(億)</p>),
      getValue: info => info.info.getCapital("D_Current")
    },
    {
      name: "收盤價",
      getValue: info =>{
        let cP = info.info.getPrice("D_closingPrice");
        let dP = info.info.getPrice("D_dailyPricing")
        let mColor;
        let comma = ''
        if(dP>0){
          mColor = 'red';
          comma = '+';
        } else if (dP<0) {
          mColor = 'green'
          comma = '';
        }
        let dPp = <p style={{ color: mColor }}>{comma}{dP}</p>
        return <p><div>{cP}</div> <div>{dPp}</div></p>
      }
    },
    {
      name: "成交量",
      getValue: info => info.info.getPrice("D_Volume")[0]
    }
  ],
  估算: [
    {
      name: "排名",
      getValue: info => info.R_estimated
    },
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
          return (<p><div>{L}</div><div>{H}</div></p>);
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
      name: (<p><div>排名</div><div>(法三)</div></p>),
      getValue: info => info.R_chip_IIR_B_Div3
    },
    {
      name: (
      <p>
        <div>
          法人(三)
        </div>
      </p>),
      getValue: info => {
        let data = info.info.getChipAnalysis("D_IIR");
        if (data.length > 0) {
          return (data[0] - data[2]).toFixed(3)
        } else {
          return -1;
        }
      }
    },
    {
      name: (
      <p>
        <div>
          法人(五)
        </div>
      </p>),
      getValue: info => {
        let data = info.info.getChipAnalysis("D_IIR");
        if (data.length > 0) {
          return (data[0] - data[4]).toFixed(3);
        } else {
          return -1;
        }
      }
    },
    {
      name: (
      <p>
        <div>
          外資(ㄧ)
        </div>
      </p>),
      getValue: info => {
        let data = info.info.getChipAnalysis("D_FIR");
        if (data.length > 0) {
          return (data[0] - data[1]).toFixed(3);
        } else {
          return -1;
        }
      }
    },
    {
      name: (
      <p>
        <div>
          外資(三)
        </div>
      </p>),
      getValue: info => {
        let data = info.info.getChipAnalysis("D_FIR");
        if (data.length > 0) {
          return (data[0] - data[2]).toFixed(3);
        } else {
          return -1;
        }
      }
    },
    {
      name: "法人(總)",
      getValue: info => info.info.getChipAnalysis("D_FIR")[0]
    },
    {
      name: "外資(總)",
      getValue: info => info.info.getChipAnalysis("D_IIR")[0]
    }
  ],
  // 技術: [
  //   {
  //     name: "5MA",
  //     getValue: info => info.MA5[info.MA5.length - 1].toFixed(2)
  //   },
  //   {
  //     name: "10MA",
  //     getValue: info => info.MA10[info.MA10.length - 1].toFixed(2)
  //   },
  //   {
  //     name: "60MA",
  //     getValue: info => info.MA20[info.MA60.length - 1].toFixed(2)
  //   }
  // ],
  股利: [
    {
      name: "排名",
      getValue: info => info.R_dividend
    },
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


class App extends Component {
  constructor(props) {
    super(props);
    this.mStockInfoManager = new mStockInfoManager();
    this.state = {
      R_module: "R_estimated",
      mKeywordList: []
    };
  }

  setR_Module(module) {
    // console.log(module);
    this.setState(state => {
      return { R_module: module };
    });
  }

  handleChange(e) {
    let raw = e.target.value||'';
    let list = raw.split(' ');
    this.setState(this.state, { mKeywordList: list });
  }

  render() {
    // let keywordList = this.state.mStockInfoManager.getKeywordList();
    let mStockInfoManager = this.mStockInfoManager;
    let { R_module, mKeywordList } = this.state;
    // let R_module = "R_estimated";
    // let mKeywordList = [];

    return (
      <div className="App container">
        {/* Button Group */}
        <ButtonToolbar>
          {Object.keys(mStockInfoManager.getRankDisplayNameObjList()).map(
            key => (
              <Button
                key={key}
                bsStyle={key === R_module ? "danger" : "info"}
                onClick={() => this.setR_Module(key)}
              >
                {mStockInfoManager.getRankDisplayNameObjList()[key]}
              </Button>
            )
          )}
        </ButtonToolbar>
        <div style={{ marginBottom: "4rem" }} />
        {/* Search Form */}
        <form inline>
          <FormGroup
            controlId="formBasicText"
            // validationState={this.getValidationState()}
          >
            <ControlLabel>關鍵字搜尋</ControlLabel>
            <FormControl
              type="text"
              // value={this.state.value}
              placeholder="搜尋.. Ex. 2330 台積電"
              // onChange={(e)=>this.handleChange(e)}
            />
            <FormControl.Feedback />
          </FormGroup>
        </form>
        <div style={{ marginBottom: "4rem" }} />
        {/* list  */}
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              {Object.keys(mlist).map(title => {
                let col = mlist[title].length;
                return <th colSpan={col}>{title}</th>;
              })}
            </tr>
            <tr>
              {Object.keys(mlist).reduce((acc, title) => {
                let item = mlist[title].map(obj => <th>{obj.name}</th>);
                return acc.concat(item);
              }, [])}
            </tr>
          </thead>
          <tbody>
            {mStockInfoManager
              .getRankList()
              [R_module].filter(id => {
                if (!mKeywordList.length) {
                  return true;
                }
                let { keywords } = mStockInfoManager.getInfobyID(id);
                let isContain = false;
                mKeywordList.forEach(item => {
                  if (keywords.includes(item)) isContain = true;
                });
                return isContain;
              })
              .slice(0, 400)
              .map(id => (
                <tr key={id}>
                  {//className = active success info warning danger
                  Object.keys(mlist).reduce((acc, title) => {
                    let item = mlist[title].map(obj => (
                      <th>{obj.getValue(mStockInfoManager.getInfobyID(id))}</th>
                    ));
                    return acc.concat(item);
                  }, [])}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    );
  }
}


export default App;

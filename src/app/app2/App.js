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
  Tooltip,
  OverlayTrigger
  // FieldGroup
} from "react-bootstrap";

import mStockInfoManager from "./utils/stockInfoManager";
import ListTypeInfo from './containers/ListTypeInfo';
import {rankObj} from './utils/rankList';


let tooltip = (info) =>(
  <Tooltip id="tooltip">
    <strong>{info}</strong>
  </Tooltip>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.mStockInfoManager = new mStockInfoManager();
    this.inputText = '';
    this.state = {
      R_module: "R_estimated",
      mKeywordList: [],
      inputText: ""
    };
  }

  setR_Module(module) {
    // console.log(module);
    this.setState(state => {
      return { R_module: module };
    });
  }

  onKeyPress(event) {
    if (event && event.key === 'Enter') {
      // this.onSearch();
      let list = this.inputText.split(' ');
      console.log(list.length!=0 ? list : "null");
      this.setState({ mKeywordList: list });
      this.inputText = '';
      this.setState({ inputText:"" });

    }
  }
  handleChange(e) {
    // let raw = e.target.value;
    // let list = raw.split(' ');
    // console.log(list.length!=0 ? list : "null");
    // this.setState({ inputText: e.target.value });
    this.inputText = e.target.value;
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
          {/* {Object.keys(mStockInfoManager.getRankDisplayNameObjList()).map(
            key => (
              <Button
                key={key}
                bsStyle={key === R_module ? "danger" : "info"}
                onClick={() => this.setR_Module(key)}
              >
                {mStockInfoManager.getRankDisplayNameObjList()[key]}
              </Button>
            )
          )} */}
          {
            rankObj.map( (obj, index) => {
              let btn = (<Button
                // key={obj.name}
                bsStyle={obj.name === R_module ? "danger" : "info"}
                onClick={() => this.setR_Module(obj.name)}
                style={{marginTop:'.5rem'}}
              >
                {obj.display}
              </Button>)
              if (obj.tooltip){
                return (
                  <OverlayTrigger
                    key={obj.name}
                    placement="bottom"
                    overlay={tooltip(obj.tooltip)}
                  >
                    {btn}
                  </OverlayTrigger>)
              }
              return btn
            })

          }
        </ButtonToolbar>
        <div style={{ marginBottom: "4rem" }} />
        {/* Search Form */}
        <div inline="true">
          <FormGroup
            controlId="formBasicText"
            // validationState={this.getValidationState()}
          >
            <ControlLabel>關鍵字搜尋</ControlLabel>
            <FormControl
              type="text"
              // value={this.state.inputText}
              onKeyPress={(event) => this.onKeyPress(event)}
              placeholder="搜尋.. Ex. 2330 台積電"
              onChange={(e)=>this.handleChange(e)}
            />
          </FormGroup>
        </div>
        <ListTypeInfo
          mStockInfoManager={mStockInfoManager}
          mKeywordList={mKeywordList}
          R_module={R_module}
        />
      </div>
    );
  }
}


export default App;

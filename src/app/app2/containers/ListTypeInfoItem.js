import React, { Component } from "react";
import { displayList, btnList, getButtonGroup } from './ListTypeInfoHelper';




class ListTypeInfoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      toggle: false
    };
  }
  onClick = () => {
    let color = this.state.color === "success" ? "" : "success";
    let toggle = !this.state.toggle;
    // console.log("toggle:"+color)
    this.setState({ color, toggle });
  };

  getDescription = () => {
    let { mStockInfoManager, id} = this.props;
    let description = mStockInfoManager.getInfobyID(id).info.getProductType();
      return (<div>描述： {description}</div>)
  }
  getBasicInfo = () => {
      return <div></div>;
    //   return [<tr>
    //       <th>Title</th>
    //   </tr> ,<tr>
    //           <th>Body</th>
    //       </tr>]
  }

  getToggleInfo = () => {
    let { id} = this.props;
    let btnGroup = getButtonGroup(id, btnList);
      return [btnGroup, this.getDescription(), ...this.getBasicInfo()];
  };

  render() {
    let { id, rank, mStockInfoManager, mKeywordList, R_module } = this.props;
    let colSpan = 0;
    let isShow = this.state.toggle ? "" : "none";
    return [
      <tr
        key={id + "-1"}
        onClick={() => this.onClick()}
        class={this.state.color}
      >
        {//className = active success info warning danger
        Object.keys(displayList).reduce((acc, title) => {
          let item = displayList[title].map((obj, i) => {
            let color = String(obj.name).includes("排名") ? "warning":"";
            let key = `${title}-${id}-${i}`;
            colSpan++;
            //每行前面添加 index
            if (i == 0 && title == "排序") {
              return <th key={key} class={"warning"}>{rank} </th>;
            }
            return (
              <th key={key} class={color} style={{ backgroundColor: obj.getColor|| ""}}>
                <div style={{ textAlign: "center" }}>{obj.getValue(mStockInfoManager.getInfobyID(id))}</div>
              </th>
            );
          });
          return acc.concat(item);
        }, [])}
      </tr>,
      <tr style={{ display: isShow}} key={id + "-2"}>
        <th colSpan={colSpan} style={{backgroundColor: '#eee' }} >
            {this.getToggleInfo()}
        </th>
      </tr>
    ];
  }
}


export default ListTypeInfoItem;
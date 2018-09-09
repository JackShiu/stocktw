
import React, { Component } from "react";
import './SideBar.css'

import { connect } from "react-redux";
import * as actionCreators from "../actions/action";


class SideBar extends Component {

constructor(props){
    super(props);
    this.state = {
        toggle: false
    }
}

listItem = (id, i, name, length) => (<div className="rank-box" key={i}>
    <li
    onClick={(e) => this.onItemClick(e)}>
        <span className="side-bar__rank">{length - i}</span> {id} {name&&name[i]}
        <i className="rank__delete-btn" onClick={(e) => this.onItemDel(e,id)} />
    </li>
    </div>)

    toggleTab(){
        this.setState({
            ... this.state,
            toggle: !this.state.toggle,
        })
    }

    onItemClick(e){
        e.stopPropagation();
        console.log("item click");
    }
    onItemDel(e, id){
        e.stopPropagation();
        console.log("item delete: "+id);
        this.props.onDeleteFromList(id);
    }

    render (){
        const { toggle} =this.state;
        const { listId, listName } = this.props.selectList;
        console.log(listId);
        return <div className={toggle ? "side-bar" : " side-bar side-bar__toggle"} onClick={() => this.toggleTab()}>
            <div className="side-bar__tag">
              <div className="side-bar__icon">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNMzAxLjMgMTQ3LjZjLTcuNS03LjUtMTkuOC03LjUtMjcuMyAwbC05NS40IDk1LjdjLTcuMyA3LjMtNy41IDE5LjEtLjYgMjYuNmw5NCA5NC4zYzMuOCAzLjggOC43IDUuNyAxMy43IDUuNyA0LjkgMCA5LjktMS45IDEzLjYtNS42IDcuNS03LjUgNy42LTE5LjcgMC0yNy4zbC03OS44LTgxIDgxLjktODEuMWM3LjUtNy41IDcuNS0xOS43LS4xLTI3LjN6Ii8+PHBhdGggZD0iTTI1NiA0OEMxNDEuMSA0OCA0OCAxNDEuMSA0OCAyNTZzOTMuMSAyMDggMjA4IDIwOCAyMDgtOTMuMSAyMDgtMjA4UzM3MC45IDQ4IDI1NiA0OHptMTI0LjQgMzMyLjRDMzQ3LjIgNDEzLjcgMzAzIDQzMiAyNTYgNDMycy05MS4yLTE4LjMtMTI0LjQtNTEuNkM5OC4zIDM0Ny4yIDgwIDMwMyA4MCAyNTZzMTguMy05MS4yIDUxLjYtMTI0LjRDMTY0LjggOTguMyAyMDkgODAgMjU2IDgwczkxLjIgMTguMyAxMjQuNCA1MS42QzQxMy43IDE2NC44IDQzMiAyMDkgNDMyIDI1NnMtMTguMyA5MS4yLTUxLjYgMTI0LjR6Ii8+PC9zdmc+" />
              </div>
            </div>
            <div className="side-bar__list">
              <p className="side-bar__title">收集清單:</p>
                <ul onClick={(e) => e.stopPropagation()}>
                    {listId && listId.map((item, i) => this.listItem(item, i, listName, listId.length))}
              </ul>
            </div>
          </div>;
    }
}

const mapStateToProps = store => (
    { selectList: store.selectList }
)

export default connect(mapStateToProps, actionCreators)(SideBar);
// export default connect(mapStateToProps, actionCreators)(SearchBtn);
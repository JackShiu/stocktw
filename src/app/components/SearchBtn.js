
import React, { Component } from "react";
import './SearchBtn.css';

import { connect } from 'react-redux';
import * as actionCreators from '../actions/action';


class SearchBtn extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputText: ''
        }
    }

    onKeyPress(event){
        if(event && event.key === 'Enter'){
            this.onSearch();
        }
    }
    onSearch(){
        if (this.state.inputText && this.state.inputText.length > 0) {
            //update to store
            this.props.onSearch &&
                this.props.onSearch(this.state.inputText);
            //clean value
            this.setState({
                inputText: ''
            });
        }
    }
    onDelete(){
        this.props.onSearchCancel &&
            this.props.onSearchCancel();
        this.setState({
            inputText: ''
        });
    }
    updateInputText(event){
        // console.log(event.target.value);
        this.setState({
            inputText: event.target.value
        })
    }

    render(){
        const { isSearch = false } = this.props.filters;
        console.log(isSearch);
        return <div className="btn-box ">
            <input type="text"
                value={this.state.inputText}
                onChange={(event) => this.updateInputText(event)}
                onKeyPress={(event) => this.onKeyPress(event)}
                // onKeyPress={(event) => this.onKeyPress(event)}
                className="search-text btn-float" />
            <input type="submit"
                onClick={() => this.onSearch()}
                value="搜尋" className="search-btn btn-float" />
            <input type="button" className="btn-float search__delete-btn"
                value="刪除搜尋"
                style={isSearch ?{}: {opacity:0}}
                onClick={() => this.onDelete()}
                 />
          </div>;
    }
}

const mapStateToProps = store => (
{ filters: store.filters}
)


export default connect(mapStateToProps,actionCreators)(SearchBtn);
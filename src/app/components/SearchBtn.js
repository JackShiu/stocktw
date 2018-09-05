
import React, { Component } from "react";
import './SearchBtn.css';

import { connect } from 'react-redux';
import * as actionCreators from '../actions/action';


class SearchBtn extends Component {
    constructor(){
        super();
        this.state = {
            inputText: ''
        }
    }

    onKeyPress(event){
        console.log(event.key)
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
    updateInputText(event){
        console.log(event.target.value);
        this.setState({
            inputText: event.target.value
        })
    }

    render(){
        return <div>
            <input type="text"
                value={this.state.inputText}
                onChange={(event) => this.updateInputText(event)}
                onKeyPress={(event) => this.onKeyPress(event)}
                // onKeyPress={(event) => this.onKeyPress(event)}
                className="search-text" />
            <input type="submit"
                onClick={() => this.onSearch()}
                value="搜尋" className="search-btn" />
          </div>;
    }
}

const mapStateToProps = store => (
{ filters: store.filters}
)


export default connect(mapStateToProps,actionCreators)(SearchBtn);
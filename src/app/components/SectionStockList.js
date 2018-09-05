import React, { Component } from "react";

import { connect } from 'react-redux';
import * as actionCreators from '../actions/action';

import "./SectionStockList.css";
import './StockInfo';
import StockInfo from "./StockInfo";


class SectionStockList extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const { filters = [], stockList = [] } = this.props;
        console.log(filters.search);
        return <section className="section-sotckinfo">
            {
                stockList && stockList.filter( (item) => {
                    if (filters && filters.search && filters.search.length > 0) {
                        return filters.search.reduce((acc, cur) => {
                            // console.log("reduce "+cur +" acc: "+ acc);
                            if (acc === true) {
                                console.log("already true");
                                return acc; //if true just return immediately
                            } else {
                                return item.conj.indexOf(cur) !== -1;
                            }
                            }, false);
                    }
                    return true;
                })
                .sort((a, b) => b.rank - a.rank)
                .slice(0, 100)
                .map((stock, i) => {
                    return <div className="stock-card" key={i} id={`rank-${i}`}>
                        <StockInfo stock={{ ...stock, index: i + 1 }} />
                      </div>;
                })
            }

          </section>;
    }

}

const mapStateToProps = store => (
    {filters: store.filters}
)

export default connect(mapStateToProps)(SectionStockList);

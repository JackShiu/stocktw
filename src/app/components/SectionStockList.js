import React, { Component } from "react";
import "./SectionStockList.css";
import './StockInfo';
import StockInfo from "./StockInfo";


class SectionStockList extends Component {

    render() {
        const { stockList=[] } = this.props;
        return <section className="section-sotckinfo">
            {
                stockList && stockList.filter( (item) => {
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

export default SectionStockList;

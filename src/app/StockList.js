
import React, { Component } from 'react';
import styled from 'styled-components';

import StyledStockInfo from 'app/StockInfo'

const textcolor0 = "#000000";
const grey5 = "#555555";
const grey6 = "#666666";
const grey7 = "#777777";
const grey8 = "#888888";
const grey9 = "#999999";
const greya = "#aaaaaa";
const greyb = "#bbbbbb";
const greyc = "#cccccc";
const greyd = "#dddddd";
const greye = "#eeeeee";
const greyf = "#ffffff";

class StockList extends Component {
    render() {
        const { children, className,stockList } = this.props;
        return (
            <div className={className}>
               { stockList.map( (stock, i)=> {
                    let {ID} = stock.req;
                    return (
                        <StyledStockInfo key={ID} stock={{...stock,index:i+1}} />
                    )
                })}
            </div>
        )
    }
}

const StyledStockList = styled(StockList)`
  background-color: ${greyd};
  width: 90%;
  margin: 0 auto;
  text-align: center;
  padding: 60px 0 ;
`;


export default StyledStockList;

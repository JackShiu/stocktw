
import React, { Component } from 'react';
import styled from 'styled-components';

import StyledStockInfo from 'app/StockInfo'
import * as color from "app/color";

class StockList extends Component {
    render() {
        const { children, className,stockList } = this.props;
        return (
            <div className={className}>
               { stockList.map( (stock, i)=> {
                    let { ID } = stock.info.getBasicID();
                    return (
                        <StyledStockInfo key={i} stock={{...stock,index:i+1}} />
                    )
                })}
            </div>
        )
    }
}

const StyledStockList = styled(StockList)`
  background-color: ${color.greyd};
  width: 90%;
  margin: 0 auto;
  text-align: center;
  padding: 60px 0 ;
`;


export default StyledStockList;

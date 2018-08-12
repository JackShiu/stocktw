import React, { Component } from 'react';
import styled from 'styled-components';

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

class Header extends Component {
    render() {
        const { children, className } = this.props;
        return (
            <header className={className}>
                {children}
            </header>
        )
    }
}

const StyledHeader = styled(Header)`
  background-color: ${greya};
  width: 100%;
  padding: 50px 20px 40px 20px;
  text-align: center;
  h1 {
    font-size: 2.5rem;
    color: ${textcolor0};
    margin-bottom: 10px;
    // border-bottom: 3px solid ${grey5}
  }

  .search-form {
    input[type=text] {
      border: 1px solid transparent;
      height: 35px;
      padding: 0 15px;
      border-radius: 5px;
      font-size: 13px;
    }
    input[type=button]{
      border-radius: 5px;
      font-size: 15px;
      padding: 8px 12px;
      margin-left: 15px;
    }

    input[type=button]:link,
    input[type=button]:visited {
      background-color:${greyf};
      border-color: ${greyf};
      color:${grey5};
    }
    input[type=button]:hover,
    input[type=button]:active {
      background-color:${grey5};
      color:${greyf};
      border-color: ${grey5};
    }
  }

`;

export default StyledHeader;
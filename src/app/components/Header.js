import React, { Component } from "react";
import "./Header.css";

import SearchBtn from "./SearchBtn";


class Header extends Component {

    render() {
        return <header>
            <div className="header__text-box">
                <h1 className="heading-primary">
                    StockTW
                </h1>
                <div className="header__search-box">
                    <SearchBtn />
                </div>
             </div>
        </header>
    }

}

export default Header;

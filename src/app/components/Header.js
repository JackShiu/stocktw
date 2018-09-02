import React, { Component } from "react";
import "./Header.css";



class Header extends Component {

    render() {
        return <header>
            <div className="header__text-box">
                <h1 className="heading-primary">
                    StockTW
                </h1>
                <div className="header__search-box">
                    <input type="text" className="search-text" />
                    <input type="submit" value="搜尋" className="search-btn" />
                </div>
             </div>
        </header>
    }

}

export default Header;

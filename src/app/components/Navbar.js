import React, { Component } from "react";
import "./Header.css";
import './Navbar.css'


class Navbar extends Component {

    render() {
        return <section className="scroll-show">
            <div className="scroll__search-box">
                <input type="text" className="search-text" />
                <input type="submit" value="搜尋" className="search-btn" />
            </div>
            <div className="scroll__delete-box">
                <h2>刪除清單:</h2>
                <div>2330</div>
                <div>2330</div>
                <div>2330</div>
                <div>2330</div>
            </div>
        </section>
    }

}

export default Navbar;

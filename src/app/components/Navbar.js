import React, { Component } from "react";
import "./Header.css";
import './Navbar.css'

import SearchBtn from "./SearchBtn";

class Navbar extends Component {

    render() {
        return <section className="nav scroll-hidden">
            <div className="nav__search-box">
                <SearchBtn />
            </div>
            {/* <div className="scroll__delete-box">
                <h2>刪除清單:</h2>
                <div>2330</div>
                <div>2330</div>
                <div>2330</div>
                <div>2330</div>
            </div> */}
        </section>
    }

}

export default Navbar;

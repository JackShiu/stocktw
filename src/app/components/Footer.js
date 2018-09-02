import React, { Component } from "react";
import "./Footer.css";



class Footer extends Component {

    render() {
        return <footer>
            <div>
                <p> You are 100% allowed to use this webpage for anything you wanted. </p>
                <p>2018 &copy; StockTW. Built by <span id="author">Jack_Shiu.</span></p>
            </div>
        </footer>
    }

}

export default Footer;

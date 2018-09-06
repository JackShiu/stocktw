
import React, { Component } from "react";

import './ScrollTopBtn.css'

class ScrollTopBtn extends Component {

    render(){
        const { autoScroll } = this.props;
        return <div id="scroll-top">
          <img
            // onClick={autoScroll('header',2000)}
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNMjU2IDQ2NGMxMTQuOSAwIDIwOC05My4xIDIwOC0yMDhTMzcwLjkgNDggMjU2IDQ4IDQ4IDE0MS4xIDQ4IDI1NnM5My4xIDIwOCAyMDggMjA4em0wLTI0NC41bC04MS4xIDgxLjljLTcuNSA3LjUtMTkuOCA3LjUtMjcuMyAwcy03LjUtMTkuOCAwLTI3LjNsOTUuNy05NS40YzcuMy03LjMgMTkuMS03LjUgMjYuNi0uNmw5NC4zIDk0YzMuOCAzLjggNS43IDguNyA1LjcgMTMuNyAwIDQuOS0xLjkgOS45LTUuNiAxMy42LTcuNSA3LjUtMTkuNyA3LjYtMjcuMyAwbC04MS03OS45eiIvPjwvc3ZnPg==" />
        </div>;
    }
}

export default ScrollTopBtn;
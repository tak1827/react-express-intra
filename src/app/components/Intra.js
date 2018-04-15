import React from 'react';
import querystring from 'querystring';
import Util from './../util.js';
import Header from './Header.js';
import Sidebar from './Sidebar.js';
import News from './News.js';
import Links from './Links.js';
import Meetings from './Meetings.js';
import Footer from './Footer.js';
import io from 'socket.io-client';

class Intra extends React.Component {
  constructor(props) {
    super(props);
    this.WS = io.connect(window.location.origin + '/ws');
  }
  
  componentDidMount () {
    /* For define functions as global & For Exectute function when page loaded */
    const script = document.createElement("script");
    script.src = "js/scripts.js";
    script.async = false;
    document.body.appendChild(script);

    // Connect to websocket
    this.WS.on('connect', function () {
      console.log("WS connected!");
    });
  }

  render() {
    return (
      <div id="screen-intra">
        <Header/>
        <Sidebar/>
        <main>
          <div className="row">
            <News WS={this.WS}/>
            <Links WS={this.WS}/>
            <Meetings WS={this.WS}/>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }
}

export default Intra;

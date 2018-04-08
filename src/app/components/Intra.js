import React from 'react';
import querystring from 'querystring';
import Util from './../util.js';
import Header from './Header.js';
import Sidebar from './Sidebar.js';
import News from './News.js';
import Links from './Links.js';
import Meetings from './Meetings.js';
import Footer from './Footer.js';

class Intra extends React.Component {

  componentDidMount () {
    const script = document.createElement("script");
    script.src = "js/scripts.js";
    script.async = false;
    document.body.appendChild(script);
  }

  render() {
    return (
      <div id="screen-intra">
        <Header/>
        <Sidebar/>
        <main>
          <div className="row">
            <News/>
            <Links/>
            <Meetings/>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }
}

export default Intra;

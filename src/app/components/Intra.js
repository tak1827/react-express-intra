import React from 'react';
import querystring from 'querystring';
import Util from './../util.js';
import Header from './Header.js';
import Sidebar from './Sidebar.js';
import News from './News.js';
import Links from './Links.js';
import Meetings from './Meetings.js';
import Users from './Users.js';
import Footer from './Footer.js';
import io from 'socket.io-client';

class Intra extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usr: {
        name: '',
        mail: '',
        admin: ''
      }
    }
    this.WS = io.connect(window.location.origin + '/ws');
  }
  
  componentDidMount () {
    M.FormSelect.init(document.querySelectorAll('select'));
    
    /* For define functions as global & For Exectute function when page loaded */
    const script = document.createElement("script");
    script.src = "js/scripts.js";
    script.async = false;
    document.body.appendChild(script);

    // Connect to websocket
    this.WS.on('connect', function () {
      console.log("WS connected!");
    });

    const query = querystring.parse(window.location.search.slice(1));
    let usr = this.state.usr;
    usr.mail = query.mail;
    usr.name = query.mail.substring(0,query.mail.indexOf("@"));
    usr.admin = query.isAdmin;
    this.setState({usr});
  }

  render() {
    return (
      <div id="screen-intra">
        <Header/>
        <Sidebar usr={this.state.usr}/>
        <main>
          <div className="row">
            <News usr={this.state.usr} WS={this.WS}/>
            <Links usr={this.state.usr} WS={this.WS}/>
            <Meetings usr={this.state.usr} WS={this.WS}/>
            {this.state.usr.admin=='true' ? (
              <Users usr={this.state.usr} WS={this.WS}/>
            ):(
              <div></div>
            )}
          </div>
        </main>
        <Footer/>
      </div>
    );
  }
}

export default Intra;

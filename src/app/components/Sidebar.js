import React from 'react';
import querystring from 'querystring';

const lsKey = 'usr';

class Sidebar extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      usr: {
      	name: '',
        mail: ''
      }
    }
  }

	componentDidMount () {
		const query = querystring.parse(window.location.search.slice(1));

		if (typeof(Storage) === "undefined") {
			alert("Local storagee don't support. Please contact to network admin.");
		} else if (query.mail) {
    	localStorage.setItem(lsKey, query.mail);
		}

		if (localStorage.getItem(lsKey)) {
			let lsusr = localStorage.getItem(lsKey);
			let susr = this.state.usr;
      susr.mail = lsusr;
      susr.name = lsusr.substring(0,lsusr.indexOf("@"));
      this.setState({susr});
		}
	}

  render() {
    return (
	    <div>
	    	<div className="container">
			    <a href="#" data-target="slide-out" className="top-nav sidenav-trigger full hide-on-large-only text-indigo">
			      <i className="material-icons">menu</i>
			    </a>
			  </div>
			  <ul id="slide-out" className="sidenav sidenav-fixed">
			    <li>
			      <div className="user-view">
			        <div className="background">
			          <img src="images/cave.jpg"/>
			        </div>
			        <img className="circle" src="images/persol-logo.png"/>
			        <span className="white-text name">{this.state.usr.name}</span>
			        <span className="white-text email">{this.state.usr.mail}</span>
			      </div>
			    </li>
			    <li>
			      <a href="#area-news"><i className="material-icons">fiber_new</i>News</a>
			    </li>
			    <li>
			      <a href="#area-links"><i className="material-icons">insert_link</i>Links</a>
			    </li>
			    <li>
			      <a href="#area-meetings"><i className="material-icons">date_range</i>Meeting Room Booking</a>
			    </li>
			    <li><div className="divider"></div></li>
			  </ul>
	    </div>
    );
  }
}

export default Sidebar;

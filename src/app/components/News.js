import React from 'react';
import ModalNews from './modal/ModalNews.js';

class News extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      news: []
    }
  }

	componentDidMount () {
		// Get all news
		const url = '/api/news';
    fetch(url, {
      method: 'get'
      // body: JSON.stringify(opts)
   	}).then((response) => {
   		if (response.status >= 200 && response.status < 300) {
   			return response.json();
   		} else {
   			throw new Error(response.statusText || response.status);
   		}
   	}).then((data) => {
      console.log(data);
      this.setState({news: data.news});
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
	  	<div id="area-news" className="col s12 m6">
	      <div className="card">
	        <div className="card-image">
	          <img src="images/mailbox.png"/>
	          <span className="card-title">News</span>
	        </div>
	        <a className="btn-floating halfway-fab waves-effect waves-light indigo modal-trigger" href="#modal-news"><i className="material-icons">add</i></a>
	        <div className="card-content">
	          <ul className="collection">
	            <NewsList news={this.state.news} />
	          </ul>
	        </div>
	        <div className="card-action">
	          <a href="#" className="black-text">(TODO:)Show more</a>
	        </div>
	      </div>

	      <ModalNews />
	      
	    </div>
    );
  }
}

function NewsList(props) {
	let newsFormed = [];
	props.news.forEach((eachNews) => {
		let d = new Date(eachNews.date);
		eachNews.date = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear();
	  if (eachNews.important == 'true') { 
	  	eachNews.className = "circle red";
	  } else {
	  	eachNews.className = "circle";
	  }
	  newsFormed.push(eachNews);
	});
	const listItems = newsFormed.map((eachNews) =>
	  <li key={eachNews.id}className="collection-item avatar">
	    <i className={eachNews.className}></i>
	    <a href="#" className="title black-text">{eachNews.title}</a>
	    <p className="date grey-text">{eachNews.date}</p>
	  </li>
	);
  return (
    <ul>{listItems}</ul>
  );
}

export default News;

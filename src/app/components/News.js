import React from 'react';
import ModalNews from './modal/ModalNews.js';
import U from './../util.js';

const defaultMaxNews = 4;
const d = document;

class News extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      news: [],
      maxNews: defaultMaxNews,
      values: {
      	ID: "",
      	DATE: "",
        TITLE: "",
        CONTENT: "",
        IMPORTANT: "false"
      }
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
  }

	componentDidMount () {
		M.Collapsible.init(d.querySelectorAll('#area-news .collapsible'));

		// Get all news
    U.fetchGet('/api/news').then((data) => {
    	let nFormed = [];
			data.news.forEach((n) => { nFormed.push(this.format(n)); });
      this.setState({news: nFormed});
      M.Dropdown.init(d.querySelectorAll('#area-news .dropdown-trigger'));
    });

    // Receive update through websocket
    this.props.WS.on('news', (data) => {
    	if (!data) { return; }
    	console.log(data);
    	let news = this.state.news;
    	if (data.type == 'new') {
    		news.unshift(this.format(data.news));
    	} else if (data.type == 'delete') {
    		news = news.filter((n) => { return n.ID == data.id ? false : true });
    	} else if (data.type == 'update') {
    		data.news = this.format(data.news);
    		news = news.map((n) => { return n.ID == data.news.ID ? data.news : n });
    	}
    	this.setState({news});
    	M.Dropdown.init(d.querySelectorAll('#area-news .dropdown-trigger'));
    });
  }

  handleClick(e) {
  	if (this.state.maxNews == this.state.news.length) { this.setState({maxNews: defaultMaxNews});} 
  	else { this.setState({maxNews: this.state.news.length}); }
  	function inner() {
  		M.Dropdown.init(d.querySelectorAll('#area-news .dropdown-trigger'));	
  	}
  	setTimeout(inner, 100);
  }

  handleDelete(e) {
    U.fetchDelete(`/api/news/${e.target.value}`).then((data) => {
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    }); 	
  }

  handleModalClick(e) {
  	// console.log(e.target.attributes);
  	const id = e.target.attributes[1].nodeValue;
  	const selected = this.state.news.filter((m) => { return m.ID == id ? true : false; });
    let values = {};
    values.ID = id == 'new' ? "" : id;
    values.DATE = id == 'new' ? new Date() : new Date(selected[0].DATE);
    values.TITLE = id == 'new' ? "" : selected[0].TITLE;
    values.CONTENT = id == 'new' ? "" : selected[0].CONTENT;
    values.IMPORTANT = id == 'new' ? "false" : selected[0].IMPORTANT;
    this.setState({values});

    d.querySelector('#modal-news [name="important"]').checked = id == 'new' ? false : selected[0].IMPORTANT=="true" ? true : false;
  }

  format(n) {
		let d = new Date(n.DATE);
		n.DATE = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear();
  	return n;
  }

  render() {
    return (
	  	<div id="area-news" className="col s12 m8">
	      <div className="card">
	        <div className="card-image">
	          <img src="images/mailbox.png"/>
	          <span className="card-title">News</span>
	        </div>
          {this.props.usr.admin=='true' ? (
            <button onClick={this.handleModalClick} className="btn-floating halfway-fab waves-effect waves-light indigo modal-trigger" href="#modal-news"><i className="material-icons" value="new">add</i>
            </button>
          ):(
            <div/>
          )}
	        <div className="card-content">

	          <ul className="collapsible z-depth-0">
	          	{this.state.news.map((n) =>
							  <li key={n.ID} id={"n-" + n.ID}>
							  	<div className="collapsible-header">
								  	<div className="col s11">
								  		<p className="title">{n.TITLE}</p>
								  		<p className="date grey-text">{n.DATE}</p>
								  	</div>
								  	<div className="col s1 center-align">
									  	{n.IMPORTANT == 'true' ? (
									  		<i className="important material-icons red-text">grade</i>
									  	):(
									  		<div/>
									  	)}
								  	</div>
								  </div>
                  <div className="collapsible-body grey lighten-5">
                  <span className="content">{n.CONTENT}</span>
                  {this.props.usr.admin=='true' ? (	
								  	<div className="right-align">
                      <br/><br/>
									  	<button onClick={this.handleModalClick} className='modal-trigger btn-floating btn-flat btn-small grey center-align' href="#modal-news">
										  	<i className="material-icons" value={n.ID}>edit</i>
										  </button>
										  &nbsp;&nbsp;
									  	<a className="dropdown-trigger btn-floating btn-flat btn-small grey center-align" data-target={"n-delete-" + n.ID}>
	                  		<i className="material-icons">delete</i>
	                  	</a>
	                  	<div id={"n-delete-" + n.ID} className='dropdown-content'>
	                      <p className="center-align">Really?</p>
	                      <ul>
	                        <li><a>No</a></li>
	                        <li><button value={n.ID} className="btn-flat" onClick={this.handleDelete}>Yes</button></li>
	                      </ul>
	                    </div>
                    </div>
                  ):(
                    <div/>
                  )}
                  </div>
							  </li>
							).slice(0, this.state.maxNews)}
	          </ul>

	        </div>
	        <div className="card-action">
	        	{this.state.news.length <= defaultMaxNews ? (
	        		<a></a>
	        	):(this.state.maxNews == this.state.news.length ? (
			          <a className="btn-flat indigo-text" onClick={this.handleClick}>Show less</a>
			        ):(
			         	<a className="btn-flat indigo-text" onClick={this.handleClick}>Show more</a>
	        		)
			      )}
	        </div>
	      </div>

	      <ModalNews values={this.state.values}/>
	      
	    </div>
    );
  }
}

export default News;

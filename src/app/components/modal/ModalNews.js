import React from 'react';
import U from './../../util.js';

class ModalNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creatBtnCls: "modal-action modal-close btn-flat disabled",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let btnCls = this.state.creatBtnCls;
    const title = document.querySelector('[name="title"]').value;
    if (title != "") {
      this.setState({creatBtnCls: btnCls.replace("disabled","")});
    } else if (!btnCls.includes("disabled")) {
      this.setState({creatBtnCls: btnCls + "disabled"});
    }
  }

  handleSubmit(e) {
    const d = document;
    const id = d.querySelector('#modal-news [type="submit"]').value;
    const date = d.querySelector('#modal-news [name="date"]').value;
    const title = d.querySelector('#modal-news [name="title"]').value;
    const content = d.querySelector('#modal-news [name="content"]').value;
    const important = d.querySelector('#modal-news [name="important"]').checked ? "true" : "false";
    const method = id == "" ? "post" : "put";
    const body = {ID: id, DATE: date, IMPORTANT: important, TITLE: title, CONTENT: content };
    const url = '/api/news';
    U.fetchPostPut(method, url, body).then((data) => {
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    });
    // U.fetchPost(url, body).then((data) => {
    //   M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    // });
    e.preventDefault();
  }

  render() {
    return (
	  	<div id="modal-news" className="modal">
        <div className="modal-content">
          <h4>News</h4>
          <form className="col s12" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="input-field col s12">
                <input type="text" name="title" onChange={this.handleChange}/>
                <label htmlFor="title">Enter Title</label>
                <span className="helper-text" data-error="Empty" data-success="">Required</span>
              </div>
              <div className="input-field col s12">
                <textarea className="materialize-textarea" name="content"></textarea>
                <label htmlFor="content">Enter Contents</label>
              </div>
              <div className="input-field col s12">
                <p>
                  <label>
                    <input type="checkbox" className="filled-in" name="important"/>
                    <span>Is this important news?</span>
                  </label>
                </p>
              </div>
            </div>
            <br/>
            <input type="hidden" className="filled-in" name="date"/>
            <div className="row right-align">
              <button type="button" className="modal-action modal-close btn-flat">Cancel</button>
              <button type="submit" className={this.state.creatBtnCls}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ModalNews;

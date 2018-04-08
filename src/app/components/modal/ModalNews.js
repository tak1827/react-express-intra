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
    const title = document.querySelector('[name="title"]').value;
    const contents = document.querySelector('[name="contents"]').value;
    const important = document.querySelector('[name="important"]').checked;
    const url = '/api/news';
    fetch(url, {
      method: 'post',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({title: title, contents: contents, important: important})
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw new Error(response.statusText || response.status);
      }
    }).then((data) => {
      console.log(data);
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    }).catch((error) => {
      console.error(error);
      M.toast({html: U.createToastHtml("Failed! Server error occour.", "fail"), displayLength: 2000});
    });
    e.preventDefault();
  }

  render() {
    return (
	  	<div id="modal-news" className="modal">
        <div className="modal-content">
          <h4>Create News</h4>
          <form className="col s12" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="input-field col s12">
                <input type="text" name="title" onChange={this.handleChange}/>
                <label htmlFor="title">Enter Title</label>
                <span className="helper-text" data-error="Empty" data-success="">Required</span>
              </div>
              <div className="input-field col s12">
                <textarea className="materialize-textarea" name="contents"></textarea>
                <label htmlFor="contents">Enter Contents</label>
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
            <div className="row right-align">
              <button type="button" className="modal-action modal-close btn-flat">Cancel</button>
              <button type="submit" className={this.state.creatBtnCls}>Create</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ModalNews;

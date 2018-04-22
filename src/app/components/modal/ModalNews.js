import React from 'react';
import U from './../../util.js';

const d = document;

class ModalNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        ID: "",
        DATE: "",
        TITLE: "",
        CONTENT: "",
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount (e) {
    // Set selected values
    M.Modal.init(d.querySelector('#modal-news.modal'), {
      'onOpenEnd' : () =>  { this.setState({values: this.props.values}); }
    });
  }

  handleChange(e) {
    let values = this.state.values;
    if (e.target.name == 'title') { values.TITLE = e.target.value; } 
    else if (e.target.name == 'content') { values.CONTENT = e.target.value; }
    this.setState({values: this.props.values});
  }

  handleSubmit(e) {
    const body = this.state.values;
    body.IMPORTANT = d.querySelector('#modal-news [name="important"]').checked ? "true" : "false";
    const method = body.ID == "" ? "post" : "put";
    U.fetchPostPut(method, '/api/news', body).then((data) => {
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    });
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
                <input type="text" name="title" value={this.state.values.TITLE} onChange={this.handleChange}/>
                <label htmlFor="title" className={this.state.values.TITLE=="" ? "" : "active"}>Enter Title</label>
                <span className="helper-text" data-error="Empty" data-success="">Required</span>
              </div>
              <div className="input-field col s12">
                <textarea className="materialize-textarea" name="content" value={this.state.values.CONTENT}  onChange={this.handleChange}></textarea>
                <label htmlFor="content" className={this.state.values.CONTENT=="" ? "" : "active"}>Enter Contents</label>
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
            <input type="hidden" className="filled-in" name="date" values={this.state.values.DATE}/>
            <div className="row right-align">
              <button type="button" className="modal-action modal-close btn-flat">Cancel</button>
              <button type="submit" className={this.state.values.TITLE=="" ? "modal-action modal-close btn-flat disabled" : "modal-action modal-close btn-flat"}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ModalNews;

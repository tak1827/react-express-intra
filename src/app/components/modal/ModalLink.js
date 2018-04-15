import React from 'react';
import U from './../../util.js';

class ModalLink extends React.Component {
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
    const categories = document.querySelector('[name="categories"]').value;
    let category = document.querySelector('[name="category"]').value;
    const name = document.querySelector('[name="name"]').value;
    const p = document.querySelector('[name="path"]').value;
    if (category == "") {
      document.querySelector('[name="category"]').value = categories;
      category = categories;
    } 
    if (category != "" && name != "" && p != "") {
      this.setState({creatBtnCls: btnCls.replace("disabled","")});
    } else if (!btnCls.includes("disabled")) {
      this.setState({creatBtnCls: btnCls + "disabled"});
    }
  }

  handleSubmit(e) {
    const d = document;
    const id = d.querySelector('#modal-link [type="submit"]').value;
    const category = d.querySelector('[name="category"]').value;
    const name = d.querySelector('[name="name"]').value;
    const p = d.querySelector('[name="path"]').value;
    const method = id == "" ? "post" : "put";
    const body = {ID: id, CATEGORY: category, NAME: name, PATH: p};
    const url = '/api/link';
    console.log(e.target);
    U.fetchPostPut(method, url, body).then((data) => {
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    });
    e.preventDefault();
  }

  render() {
    return (
	  	<div id="modal-link" className="modal">
        <div className="modal-content">
          <h4>Link</h4>
          <form className="col s12" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="input-field col s6">
                <select defaultValue="" name="categories" onChange={this.handleChange}>
                  <option value=""></option>                  
                  {this.props.links.map((item, i) =>
                    <option key={i} value={item.category}>{item.category}</option>
                  )}
                </select>
                <label>Category</label>
              </div>
              <div className="input-field col s6">
                <input type="text" name="category" onChange={this.handleChange}/>
                <span className="helper-text" data-error="Empty" data-success="">Required</span>
              </div>
              <div className="input-field col s12">
                <input type="text" name="name" onChange={this.handleChange}/>
                <label htmlFor="name">Enter Name</label>
                <span className="helper-text" data-error="Empty" data-success="">Required</span>
              </div>
              <div className="input-field col s12">
                <input type="text" name="path" onChange={this.handleChange}/>
                <label htmlFor="path">Enter Path</label>
                <span className="helper-text" data-error="Empty" data-success="">Required</span>
              </div>
            </div>
            <br/>
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

export default ModalLink;

import React from 'react';
import U from './../../util.js';

const d = document;

class ModalLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        ID: "",
        CATEGORY: "",
        NAME: "",
        PATH: "",
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount (e) {
    // Set selected values
    M.Modal.init(d.querySelector('#modal-link.modal'), {
      'onOpenEnd' : () =>  { this.setState({values: this.props.values}); }
    });
  }

  handleChange(e) {
    let values = this.state.values;
    if (e.target.name == 'categories') { values.CATEGORY = e.target.value; } 
    else if (e.target.name == 'category') { values.CATEGORY = e.target.value; } 
    else if (e.target.name == 'name') { values.NAME = e.target.value; } 
    else if (e.target.name == 'path') { values.PATH = e.target.value; }
    this.setState({values: this.props.values});
  }

  handleSubmit(e) {
    const d = d;
    const body = this.state.values;
    const method = body.ID == "" ? "post" : "put";
    U.fetchPostPut(method, '/api/link', body).then((data) => {
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
                <select name="categories" onChange={this.handleChange}>
                  <option value=""></option>                  
                  {this.props.links.map((item, i) =>
                    <option key={i} value={item.category}>{item.category}</option>
                  )}
                </select>
                <label>Category</label>
              </div>
              <div className="input-field col s6">
                <input type="text" name="category" value={this
                  .state.values.CATEGORY} onChange={this.handleChange}/>
                <span className="helper-text" data-error="Empty" data-success="">Required</span>
              </div>
              <div className="input-field col s12">
                <input type="text" name="name" value={this.state.values.NAME} onChange={this.handleChange}/>
                <label htmlFor="name" className={this.state.values.NAME =="" ? "" : "active"}>Enter Name</label>
                <span className="helper-text" data-error="Empty" data-success="">Required</span>
              </div>
              <div className="input-field col s12">
                <input type="text" name="path" value={this.state.values.PATH} onChange={this.handleChange}/>
                <label htmlFor="path" className={this.state.values.PATH =="" ? "" : "active"}>Enter Path</label>
                <span className="helper-text" data-error="Empty" data-success="">Required</span>
              </div>
            </div>
            <br/>
            <div className="row right-align">
              <button type="button" className="modal-action modal-close btn-flat">Cancel</button>
              <button type="submit" className={this.state.values.CATEGORY=="" || this.state.values.NAME=="" || this.state.values.PATH=="" ? "modal-action modal-close btn-flat disabled" : "modal-action modal-close btn-flat"}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ModalLink;

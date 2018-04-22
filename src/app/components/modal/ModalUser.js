import React from 'react';
import U from './../../util.js';
import DateFormat from 'dateformat';

const d = document;

class ModalMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mailValCls: "validate",
      values: {
        ID: "",
        MAIL: "",
        PASSWORD: "",
        INFO: "",
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount (e) {
    // Set selected values
    M.Modal.init(d.querySelector('#modal-user.modal'), {
      'onOpenEnd' : () =>  { this.setState({values: this.props.values}); }
    });
  }

  handleChange(e) {    
    let values = this.state.values;
    if (e.target.name == 'mail') { values.MAIL = e.target.value;} 
    else if (e.target.name == 'password') { values.PASSWORD = e.target.value; } 
    else if (e.target.name == 'info') { values.INFO = e.target.value; }
    this.setState({values: this.props.values});
  }

  handleSubmit(e) {
    e.preventDefault();
    const body = this.state.values;
    const sameMail = this.props.usrs.filter((u) => { return u.MAIL == body.MAIL ? true : false; });
    if (body.ID == "" && sameMail.length != 0) {// Mail dupliate check
        this.setState({mailValCls: "invalid"});
        return;
    }

    body.ADMIN = d.querySelector('#modal-user [name="admin"]').checked ? "true" : "false";
    const method = body.ID == "" ? "post" : "put";
    U.fetchPostPut(method, '/api/user', body).then((data) => {
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    });
    M.Modal.getInstance(document.querySelector('#modal-user')).close()
  }

  render() {
    return (
	  	<div id="modal-user" className="modal">
      <div className="modal-content">
        <h4>User</h4>
        <form className="col s12" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field col s12 m6">
              <input type="email" name="mail" className={this.state.mailValCls} value={this.state.values.MAIL} onChange={this.handleChange}/>
              <label htmlFor="mail" className={this.state.values.MAIL=="" ? "" : "active"}>Enter Mail</label>
              <span className="helper-text" data-error="Invalid" data-success="">Required</span>
            </div>
            <div className="input-field col s12 m6">
              <input type="text" name="password" value={this.state.values.PASSWORD} onChange={this.handleChange}/>
              <label htmlFor="password" className={this.state.values.PASSWORD=="" ? "" : "active"}>Enter Password</label>
              <span className="helper-text" data-error="Empty" data-success="">Required</span>
            </div>
            <div className="input-field col s12">
              <input type="text" name="info" value={this.state.values.INFO} onChange={this.handleChange}/>
              <label htmlFor="info" className={this.state.values.INFO=="" ? "" : "active"}>Enter Info</label>
            </div>
            <div className="input-field col s12">
              <p>
                <label>
                  <input type="checkbox" className="filled-in" name="admin"/>
                  <span>Grant administrator authority</span>
                </label>
              </p>
            </div>
          </div>
          <div className="row right-align">
            <button type="button" className="modal-action modal-close btn-flat">Cancel</button>
            <button type="submit" className={this.state.values.MAIL=="" || this.state.values.PASSWORD=="" ? "modal-action  btn-flat disabled" : "modal-action  btn-flat"}>Submit</button>
          </div>
        </form>
      </div>
    </div>
    );
  }
}

export default ModalMeeting;

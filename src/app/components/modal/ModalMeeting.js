import React from 'react';
import U from './../../util.js';
import DateFormat from 'dateformat';

const d = document;

class ModalMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startValCls: "validate",
      endValCls: "validate",
      values: {
        ID: "",
        date: "",
        start: "",
        end: "",
        INFO: "",
        ROOM: ""
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount (e) {
    // Set selected values
    M.Modal.init(d.querySelector('#modal-meeting.modal'), {
      'onOpenEnd' : () =>  { 
        this.setState({values: this.props.values});
        this.checkVal(this.state.values);
      }
    });
  }

  handleChange(e) {
    let values = this.state.values;
    if (e.target.name == 'date') { values.date = e.target.value;} 
    else if (e.target.name == 'start') { values.start = e.target.value; } 
    else if (e.target.name == 'end') { values.end = e.target.value; } 
    else if (e.target.name == 'room') { values.ROOM = e.target.value; } 
    else if (e.target.name == 'info') { values.INFO = e.target.value; }
    this.setState({values: this.props.values});
    this.checkVal(values);
  }

  checkVal(values) {
    const room = values.ROOM;
    const st = new Date(values.date + " " + values.start);
    const ed = new Date(values.date + " " + values.end);
    if (st >= ed) {
      this.setState({startValCls: "invalid"});
      return;
    }
    this.setState({startValCls: "valid"});
    if (room != "") {
      let isStartValid = true;
      let isEndValid = true;
      this.props.meetings.forEach((m) => {
        if (values.ID == m.ID) { return; }
        if (room == m.ROOM) {
          if (st >= new Date(m.START_DT) && st <= new Date(m.END_DT)) { isStartValid = false; }
          if (ed >= new Date(m.START_DT) && ed <= new Date(m.END_DT)) { isEndValid = false; }
          if (st <= new Date(m.START_DT) && ed >= new Date(m.END_DT)) { isEndValid = false; }
        }
      });
      if (isStartValid) {this.setState({startValCls: "valid"}); }
      else {this.setState({startValCls: "invalid"}); }
      if (isEndValid) { this.setState({endValCls: "valid"}); }
      else { this.setState({endValCls: "invalid"}); }
    }
  }

  handleSubmit(e) {
    const values = this.state.values;
    let body = {};
    body.ID = values.ID;
    body.START_DT = new Date(`${values.date} ${values.start}`);
    body.END_DT = new Date(`${values.date} ${values.end}`);
    body.ROOM = d.querySelector('#modal-meeting [name="room"]').value;
    body.MAIL = this.props.usr.mail;
    body.INFO = values.INFO;
    body.ANY = d.querySelector('#modal-meeting [name="any"]').checked ? "true" : "false";
    const method = body.ID == "" ? "post" : "put";
    U.fetchPostPut(method, '/api/meeting', body).then((data) => {
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    });
    e.preventDefault();
  }

  render() {
    return (
	  	<div id="modal-meeting" className="modal">
      <div className="modal-content">
        <h4>Meeting Room Resavation</h4>
        <form className="col s12" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field col s4">
              <input type="date" name="date" value={this.state.values.date} onChange={this.handleChange}/>
              <label>Date</label>
              <span className="helper-text" data-error="Empty" data-success="">Required</span>
            </div>
            <div className="input-field col s1">
              <p className="center-align">:</p>
            </div>
            <div className="input-field col s3">
              <input className={this.state.startValCls} type="time" name="start" value={this.state.values.start} onChange={this.handleChange}/>
              <label>Start</label>
              <span className="helper-text" data-error="Invalid" data-success="">Required</span>
            </div>
            <div className="input-field col s1">
              <p className="center-align">-</p>
            </div>
            <div className="input-field col s3">
              <input className={this.state.endValCls} type="time" name="end" value={this.state.values.end} onChange={this.handleChange}/>
              <label>End</label>
              <span className="helper-text" data-error="Invalid" data-success="">Required</span>
            </div>
            <div className="input-field col s6">
              <select name="room" onChange={this.handleChange}>
                <option value=""></option>
                {this.props.rooms.map((item, i) =>
                  <option key={i} value={item}>{item}</option>
                )}
              </select>
              <label>Room</label>
              <span className="helper-text" data-error="Empty" data-success="">Required</span>
            </div>
            <div className="input-field col s12">
              <input type="text" name="info" value={this.state.values.INFO} onChange={this.handleChange}/>
              <label htmlFor="info" className={this.state.values.INFO=="" ? "" : "active"}>Enter Info</label>
            </div>
            <div className="input-field col s12">
              <p>
                <label>
                  <input type="checkbox" className="filled-in" name="any"/>
                  <span>Anyonw can delete?</span>
                </label>
              </p>
            </div>
          </div>
          <div className="row right-align">
            <button type="button" className="modal-action modal-close btn-flat">Cancel</button>
            <button type="submit" className={this.state.startValCls!="valid" || this.state.endValCls!="valid" || this.state.values.ROOM=="" ? "modal-action modal-close btn-flat disabled" : "modal-action modal-close btn-flat"}>Submit</button>
          </div>
        </form>
      </div>
    </div>
    );
  }
}

export default ModalMeeting;

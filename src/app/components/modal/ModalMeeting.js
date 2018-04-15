import React from 'react';
import U from './../../util.js';
import DateFormat from 'dateformat';

const lsKey = 'usr';

class ModalMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creatBtnCls: "modal-action modal-close btn-flat disabled",
      startValCls: "validate",
      endValCls: "validate",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let btnCls = this.state.creatBtnCls;
    const date = document.querySelector('#modal-meeting [name="date"]').value;
    const start = document.querySelector('#modal-meeting [name="start"]').value;
    const end = document.querySelector('#modal-meeting [name="end"]').value;
    const room = document.querySelector('#modal-meeting [name="room"]').value;
    if (date != "" && start != "" && end != "") {
      const s = new Date(date + " " + start);
      const e = new Date(date + " " + end);
      if (s >= e) {
        this.setState({startValCls: "invalid"});
        if (!btnCls.includes("disabled")) { this.setState({creatBtnCls: btnCls + "disabled"}); }
        return;
      }
      this.setState({startValCls: "valid"});
    }
    if (date != "" && start != "" && end != "" && room != "") {
      const s = new Date(date + " " + start);
      const e = new Date(date + " " + end);
      let isStartValid = true;
      let isEndValid = true;
      this.props.meetings.forEach((m) => {
        if (room == m.ROOM && s >= new Date(m.START_DT) && s <= new Date(m.END_DT)) {
          isStartValid = false;
          this.setState({startValCls: "invalid"}); 
        }
        if (room == m.ROOM && e >= new Date(m.START_DT) && e <= new Date(m.END_DT)) {
          isEndValid = false;
          this.setState({endValCls: "invalid"});
        }
        if (room == m.ROOM && s <= new Date(m.START_DT) && e >= new Date(m.END_DT)) {
          isEndValid = false;
          this.setState({endValCls: "invalid"});
        }
      });
      if (isStartValid) { this.setState({startValCls: "valid"}); }
      if (isEndValid) { this.setState({endValCls: "valid"}); }
      if (isStartValid && isEndValid) {
        this.setState({creatBtnCls: btnCls.replace("disabled","")});
        return;
      }
    }
    if (!btnCls.includes("disabled")) { this.setState({creatBtnCls: btnCls + "disabled"}); }
  }

  handleSubmit(e) {
    const d = document;
    const id = d.querySelector('#modal-meeting [type="submit"]').value;
    let date = d.querySelector('#modal-meeting [name="date"]').value;
    let start = d.querySelector('#modal-meeting [name="start"]').value;
    let end = d.querySelector('#modal-meeting [name="end"]').value;
    start = new Date(date + " " + start);
    end = new Date(date + " " + end);
    const room = d.querySelector('#modal-meeting [name="room"]').value;
    const mail = localStorage.getItem(lsKey);
    const info = d.querySelector('#modal-meeting [name="info"]').value;
    const any = d.querySelector('#modal-meeting [name="any"]').checked ? "true" : "false";
    const method = id == "" ? "post" : "put";
    const body = {ID: id, START_DT: start, END_DT: end, ROOM: room, MAIL: mail, INFO: info, ANY: any};
    const url = '/api/meeting';
    console.log(body)
    U.fetchPostPut(method, url, body).then((data) => {
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
              <input type="date" name="date" onChange={this.handleChange}/>
              <label>Date</label>
              <span className="helper-text" data-error="Empty" data-success="">Required</span>
            </div>
            <div className="input-field col s1">
              <p className="center-align">:</p>
            </div>
            <div className="input-field col s3">
              <input className={this.state.startValCls} type="time" name="start" onChange={this.handleChange}/>
              <label>Start</label>
              <span className="helper-text" data-error="Invalid" data-success="">Required</span>
            </div>
            <div className="input-field col s1">
              <p className="center-align">-</p>
            </div>
            <div className="input-field col s3">
              <input className={this.state.endValCls} type="time" name="end" onChange={this.handleChange}/>
              <label>End</label>
              <span className="helper-text" data-error="Invalid" data-success="">Required</span>
            </div>
            <div className="input-field col s6">
              <select defaultValue="" name="room" onChange={this.handleChange}>
                <option value=""></option>
                {this.props.rooms.map((item, i) =>
                  <option key={i} value={item}>{item}</option>
                )}
              </select>
              <label>Room</label>
              <span className="helper-text" data-error="Empty" data-success="">Required</span>
            </div>
            <div className="input-field col s12">
              <input type="text" name="info"/>
              <label htmlFor="info">Enter Info</label>
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
            <button type="submit" className={this.state.creatBtnCls}>Submit</button>
          </div>
        </form>
      </div>
    </div>
    );
  }
}

export default ModalMeeting;

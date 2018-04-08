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
    const date = document.querySelector('[name="date"]').value;
    const start = document.querySelector('[name="start"]').value;
    const end = document.querySelector('[name="end"]').value;
    const room = document.querySelector('[name="room"]').value;
    if (date != "" && start != "" && end != "") {
      const s = new Date(date + " " + start);
      const e = new Date(date + " " + end);
      if (s >= e) {
        this.setState({startValCls: "invalid"});
        if (!btnCls.includes("disabled")) {
          this.setState({creatBtnCls: btnCls + "disabled"});
        }
        console.log("path1");
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
        if (room == m.room && s >= new Date(m.start) && s <= new Date(m.end)) {
          isStartValid = false;
          console.log("path2")
          this.setState({startValCls: "invalid"}); 
        }
        if (room == m.room && e >= new Date(m.start) && e <= new Date(m.end)) {
          isEndValid = false;
          console.log("path3")
          this.setState({endValCls: "invalid"});
        }
        if (room == m.room && s <= new Date(m.start) && e >= new Date(m.end)) {
          isEndValid = false;
          console.log("path4")
          this.setState({endValCls: "invalid"});
        }
      });
      console.log("path5")
      if (isStartValid) {
        this.setState({startValCls: "valid"});
      }
      if (isEndValid) {
        this.setState({endValCls: "valid"});
      }
      if (isStartValid && isEndValid) {
        this.setState({creatBtnCls: btnCls.replace("disabled","")});
        return;
      }
    }
    if (!btnCls.includes("disabled")) {
      this.setState({creatBtnCls: btnCls + "disabled"});
    }
  }

  handleSubmit(e) {
    let date = document.querySelector('[name="date"]').value;
    let start = document.querySelector('[name="start"]').value;
    let end = document.querySelector('[name="end"]').value;
    start = new Date(date + " " + start);
    end = new Date(date + " " + end);
    // start = (new Date(date + " " + start)).setUTCHours(6);
    // end = (new Date(date + " " + end)).setUTCHours(6);
    const room = document.querySelector('[name="room"]').value;
    const mail = localStorage.getItem(lsKey);
    const info = document.querySelector('[name="info"]').value;
    const any = document.querySelector('[name="any"]').checked;
    const url = '/api/meeting';
    fetch(url, {
      method: 'post',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({start: start, end: end, room: room, mail: mail, info: info, any: any})
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
    const listItems = this.props.rooms.map((item, i) =>
      <option key={i} value={item}>{item}</option>
    );
    return (
	  	<div id="modal-meeting" className="modal">
      <div className="modal-content">
        <h4>Create Resavation</h4>
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
                {listItems}
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
            <button type="submit" className={this.state.creatBtnCls}>Create</button>
          </div>
        </form>
      </div>
    </div>
    );
  }
}

export default ModalMeeting;

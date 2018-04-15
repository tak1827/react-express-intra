import React from 'react';
import DateFormat from 'dateformat';
import ModalMeeting from './modal/ModalMeeting.js';
import U from './../util.js';

const lsKey = 'usr';

class Meetings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meetings: [],
      rooms: [],
      filteredMeetings: [],
      periodFilter: "all",
      roomFilter: "all" 
    }
    this.fileterMeeting = this.fileterMeeting.bind(this);
    this.handlePeriodFiler = this.handlePeriodFiler.bind(this);
    this.handleRoomFiler = this.handleRoomFiler.bind(this);
    this.format = this.format.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
  }

  componentDidMount () {
    // Get all meetings
    const url = '/api/meetings';
    U.fetchGet(url).then((data) => {
      let meetings = [];  
      let rooms = [];
      data.meetings.forEach((m) => {        
        if (!rooms.includes(m.ROOM)) { rooms.push(m.ROOM); }
        meetings.push(this.format(m));
      });
      this.setState({rooms: rooms});
      this.setState({meetings: meetings});
      this.setState({filteredMeetings: meetings});// Initialize
    });

    // Receive update through websocket
    this.props.WS.on('meetings', (data) => {
      if (!data) { return; }
      console.log(data);
      let meetings = this.state.meetings;
      if (data.type == 'new') {
        meetings.push(this.format(data.meeting));
      } else if (data.type == 'delete') {
        meetings = meetings.filter((m) => { return m.ID == data.id ? false : true });
      } else if (data.type == 'update') {
        data.meeting = this.format(data.meeting);
        meetings = meetings.map((m) => { return m.ID == data.meeting.ID ? data.meeting : m });
      }
      meetings.sort((a, b) => {
        if (a.START_DT < b.START_DT) return -1;
        if (a.START_DT > b.START_DT) return 1;
        return 0;
      });
      console.log(meetings)
      this.setState({meetings: meetings});
      this.setState({
        filteredMeetings: this.fileterMeeting(this.state.periodFilter, this.state.roomFilter)
      });
      M.AutoInit();
    });
  }

  fileterMeeting(period, room) {
    return this.state.meetings.filter((m) => {
      let now = new Date();
      let to = new Date().setDate(now.getDate()+Number(period));
      let end = new Date(m["END_DT"]);
      if (period == "all" && room == "all") {
        return true;
      } else if (period == "all" && room == m["ROOM"]) {
        return true;
      } else if (now < end && end < to && room == "all") {
        return true;
      } else if (now < end && end < to && room == m["ROOM"]) {
        return true;
      }
      return false;
    });
  }

  handlePeriodFiler(e) {
    this.setState({
      periodFilter: e.target.value,
      filteredMeetings: this.fileterMeeting(e.target.value, this.state.roomFilter)
    });
  }

  handleRoomFiler(e) {
    this.setState({
      roomFilter: e.target.value,
      filteredMeetings: this.fileterMeeting(this.state.periodFilter, e.target.value)
    });
  }

  handleModalClick(e) {
    const id = e.target.attributes[1].nodeValue;
    const selected = this.state.meetings.filter((m) => { return m.ID == id ? true : false; });
    const d = document;
    let now = new Date();
    d.querySelector('#modal-meeting [name="date"]').value = selected.length == 0 ? DateFormat(now, "yyyy-mm-dd") : DateFormat(selected[0].START_DT, "yyyy-mm-dd");
    d.querySelector('#modal-meeting [name="start"]').value = selected.length == 0 ? DateFormat(now, "HH:MM") : DateFormat(selected[0].START_DT, "HH:MM");
    d.querySelector('#modal-meeting [name="end"]').value = selected.length == 0 ? DateFormat(now.setHours(now.getHours()+1), "HH:MM") : DateFormat(selected[0].END_DT, "HH:MM");
    d.querySelector('#modal-meeting [name="room"]').value = selected.length == 0 ? "" : selected[0].ROOM;
    d.querySelector('#modal-meeting [name="info"]').value = selected.length == 0 ? "" : selected[0].INFO;
    d.querySelector('#modal-meeting [name="any"]').checked = selected.length == 0 ? false : selected[0].any;
    d.querySelector('#modal-meeting [type="submit"]').value = selected.length == 0 ? "" : id;
  }

  handleDelete(e) {
    const url = '/api/meeting/' + e.target.value;
    U.fetchDelete(url).then((data) => {
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    });
  }

  format(m) {
    let start = new Date(m.START_DT);
    let end = new Date(m.END_DT);
    m.date = DateFormat(start, "mm/dd");
    m.period = DateFormat(start, "HH:MM") + "-" + DateFormat(end, "HH:MM");
    m.person = m.MAIL.substring(0,m.MAIL.indexOf("@")); 
    if (m.ANY == 'true') { 
      m.any = true;
      m.disabledCls = false;
    } else if (localStorage.getItem(lsKey) && m.MAIL == localStorage.getItem(lsKey)) {
      m.any = false;
      m.disabledCls = false;
    } else {
      m.any = false;
      m.disabledCls = true;
    }
    return m;
  }

  render() {
    return (
    	<div id="area-meetings"  className="col s12 m12">
        <div className="card">
          <div className="card-image">
            <img src="images/meeting.png"/>
            <span className="card-title">Meeting Room Booking</span>
          </div>
          <button onClick={this.handleModalClick} className="btn-floating halfway-fab waves-effect waves-light indigo modal-trigger" href="#modal-meeting"><i className="material-icons" value="new">add</i></button>
          <div className="card-content">
            <div className="row">

              <div className="col s6 m4">
                <div className="input-field col s12">
                  <select defaultValue={this.state.periodFilter} onChange={this.handlePeriodFiler}>
                    <option value="all">All</option>
                    <option value="1">1day</option>
                    <option value="7">7day</option>
                    <option value="30">30day</option>                    
                  </select>
                  <label>Period</label>
                </div>
              </div>

              <div className="col s6 m4">
                <div className="input-field col s12">
                  <select defaultValue={this.state.roomFilter} onChange={this.handleRoomFiler}>
                    <option value="all">All</option>
                      {this.state.rooms.map((item, i) =>
                        <option key={i} value={item}>{item}</option>
                      )}
                  </select>
                  <label>Room</label>
                </div>
              </div>

              <div className="col s12 m12">
                <table>
                  <thead>
                    <tr>
                      <th width="50px">Date</th>
                      <th width="100px">Time</th>
                      <th>Room</th>
                      <th>Preson</th>
                      <th>Info</th>
                      <th width="50px">Edit</th>
                      <th width="50px">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.filteredMeetings.map((m) =>
                      <tr key={m.START_DT + "-" + m.ROOM}>
                        <td>{m.date}</td>
                        <td>{m.period}</td>
                        <td>{m.ROOM}</td>
                        <td>{m.person}</td>
                        <td>{m.INFO}</td>
                        <td className="center-align">
                          <button onClick={this.handleModalClick} className={m.disabledCls==true ? "btn-floating btn-small grey disabled" : "modal-trigger btn-floating btn-small grey"}  href="#modal-meeting">
                            <i className="material-icons" value={m.ID}>edit</i>
                          </button>
                        </td>
                        <td className="center-align">
                          <button className={m.disabledCls==true ? "btn-floating btn-small grey disabled" : "dropdown-trigger btn-floating btn-small grey"} data-target={"m-delete-" + m.ID}>
                            <i className="material-icons">delete</i>
                          </button>
                          <div id={"m-delete-" + m.ID} className='dropdown-content'>
                            <p className="center-align">Really?</p>
                            <ul>
                              <li><a>No</a></li>
                              <li><button value={m.ID} className="btn-flat" onClick={this.handleDelete}>Yes</button></li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  
                </table>
              </div>
              
            </div>
          </div>
        </div>
        <ModalMeeting meetings={this.state.meetings} rooms={this.state.rooms}/>
      </div>
    );
  }
}

export default Meetings;

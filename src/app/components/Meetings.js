import React from 'react';
import DateFormat from 'dateformat';
import ModalMeeting from './modal/ModalMeeting.js';

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
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount () {
    // Get all meetings
    const url = '/api/meetings';
    fetch(url, {
      method: 'get'
      // body: JSON.stringify(opts)
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw new Error(response.statusText || response.status);
      }
    }).then((data) => {
      console.log(data);
      let rooms = [];
      data.meetings.filter((item, i) => {
        if (rooms.includes(item.room)) {
          return false
        }
        rooms.push(item.room);
        return true;
      });
      this.setState({rooms: rooms});
      this.setState({meetings: data.meetings});
      this.setState({filteredMeetings: data.meetings});// Initialize
    }).catch((error) => {
      console.error(error);
    });
  }

  fileterMeeting(period, room) {
    return this.state.meetings.filter((meeting) => {
      let now = new Date();
      let to = new Date().setDate(now.getDate()+Number(period));
      let start = new Date(meeting["start"]);
      if (period == "all" && room == "all") {
        return true;
      } else if (period == "all" && room == meeting["room"]) {
        return true;
      } else if (now < start && start < to && room == "all") {
        return true;
      } else if (now < start && start < to && room == meeting["room"]) {
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

  handleClick(e) {
    let now = new Date();
    document.querySelector('[name="date"]').value = DateFormat(now, "yyyy-mm-dd");
    document.querySelector('[name="start"]').value = DateFormat(now, "HH:MM");
    document.querySelector('[name="end"]').value = DateFormat(now.setHours(now.getHours()+1), "HH:MM");
  }

  render() {
    const listItems = this.state.rooms.map((item, i) =>
      <option key={i} value={item}>{item}</option>
    );
    return (
    	<div id="area-meetings"  className="col s12 m12">
        <div className="card">
          <div className="card-image">
            <img src="images/meeting.png"/>
            <span className="card-title">Meeting Room Booking</span>
          </div>
          <a className="btn-floating halfway-fab waves-effect waves-light indigo modal-trigger" href="#modal-meeting"><i className="material-icons" onClick={this.handleClick}>add</i></a>
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
                    {listItems}
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
                      <th width="50px">Delete</th>
                    </tr>
                  </thead>
                  <MeetingsList meetings={this.state.filteredMeetings} />
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

function MeetingsList(props) {
  let meetingsFormed = [];
  props.meetings.forEach((eachMeetings) => {
    let start = new Date(eachMeetings.start);
    let end = new Date(eachMeetings.end);
    eachMeetings.date = DateFormat(start, "mm/dd");
    eachMeetings.period = DateFormat(start, "HH:MM") + "-" + DateFormat(end, "HH:MM");
    eachMeetings.person = eachMeetings.mail.substring(0,eachMeetings.mail.indexOf("@"));
    let devDeleteIcon = <a className="btn-floating btn-small waves-effect waves-light grey z-depth-0"><i className="material-icons">delete</i></a>;
    if (eachMeetings.any == 'true') { 
      eachMeetings.disabled = devDeleteIcon;
    } else if (localStorage.getItem(lsKey) && eachMeetings.mail == localStorage.getItem(lsKey)) {
      eachMeetings.disabled = devDeleteIcon;
    } else {
      eachMeetings.disabled = "";
    }
    meetingsFormed.push(eachMeetings);
  });
  const listItems = meetingsFormed.map((eachMeetings) =>
    <tr key={eachMeetings.start + "-" + eachMeetings.room}>
      <td>{eachMeetings.date}</td>
      <td>{eachMeetings.period}</td>
      <td>{eachMeetings.room}</td>
      <td>{eachMeetings.person}</td>
      <td>{eachMeetings.info}</td>
      <td className="center-align">{eachMeetings.disabled}</td>
    </tr>
  );
  return (
    <tbody>{listItems}</tbody>
  );
}

export default Meetings;

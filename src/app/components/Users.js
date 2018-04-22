import React from 'react';
import DateFormat from 'dateformat';
import ModalUser from './modal/ModalUser.js';
import U from './../util.js';

const d = document;

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usrs: [],
      uFiltered: [],
      fWord: "",
      values: {
        ID: "",
        MAIL: "",
        PASSWORD: "",
        INFO: "",
      }
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
  }

  componentDidMount () {
    // Get all users
    U.fetchGet('/api/users').then((data) => {
      let usrs = data.usrs;  
      // data.users.forEach((m) => {        
      //   if (!rooms.includes(m.ROOM)) { rooms.push(m.ROOM); }
      //   users.push(this.format(m));
      // });
      this.setState({usrs});
      this.setState({uFiltered: usrs});// Initialize
      M.Dropdown.init(d.querySelectorAll('#area-users .dropdown-trigger'));
    });

    // Receive update through websocket
    this.props.WS.on('users', (data) => {
      if (!data) { return; }
      console.log(data);
      let usrs = this.state.usrs;
      if (data.type == 'new') {
        usrs.push(data.usr);
      } else if (data.type == 'delete') {
        usrs = usrs.filter((u) => { return u.ID == data.id ? false : true });
      } else if (data.type == 'update') {
        usrs = usrs.map((u) => { return u.ID == data.usr.ID ? data.usr : u });
      }
      usrs.sort((a, b) => {
        if (a.MAIL < b.MAIL) return -1;
        if (a.MAIL > b.MAIL) return 1;
        return 0;
      });
      this.setState({usrs});
      this.setState({ uFiltered: this.uFiltering(this.state.fWord) });
      M.Dropdown.init(d.querySelectorAll('#area-users .dropdown-trigger'));
    });
  }

  uFiltering(w) {
    return this.state.usrs.filter((u) => {
      if (u.MAIL.toLowerCase().includes(w.toLowerCase())) { return true; }
      if (u.INFO.toLowerCase().includes(w.toLowerCase())) { return true; }
      return false;
    });
  }

  handleSearch(e) {
    this.setState({fWord: e.target.value});
    this.setState({uFiltered: this.uFiltering(e.target.value)});
  }

  handleModalClick(e) {
    const id = e.target.attributes[1].nodeValue;
    const selected = this.state.usrs.filter((u) => { return u.ID == id ? true : false; });
    let values = {};
    values.ID = id == 'new' ? "" : id;
    values.MAIL = selected.length == 0 ? "@persol.co.jp" : selected[0].MAIL;
    values.PASSWORD = selected.length == 0 ? Math.random().toString(36).substring(2, 10) : selected[0].PASSWORD;
    values.INFO = selected.length == 0 ? "" : selected[0].INFO;
    this.setState({values});

    d.querySelector('#modal-user [name="admin"]').checked = selected.length == 0 ? false : selected[0].ADMIN == 'true' ? true : false;
  }

  handleDelete(e) {
    U.fetchDelete(`/api/user/${e.target.value}`).then((data) => {
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    });
  }

  render() {
    return (
    	<div id="area-users"  className="col s12 m12">
        <div className="card">
          <div className="card-image">
            <img src="images/fish.png"/>
            <span className="card-title">Users</span>
          </div>
          <button onClick={this.handleModalClick} className="btn-floating halfway-fab waves-effect waves-light indigo modal-trigger" href="#modal-user"><i className="material-icons" value="new">add</i></button>
          <div className="card-content">
            <div className="row">

              <div className="col s12 m6">
                <div className="input-field col s12">
                  <i className="material-icons prefix">search</i>
                  <input placeholder="Enter any word" type="text" onChange={this.handleSearch}/>
                </div>
              </div>

              <div className="col s12 m12">
                <table>
                  <thead>
                    <tr>
                      <th>Mail</th>
                      <th>Info</th>
                      <th width="50px" className="center-align">Amin</th>
                      <th width="50px" className="center-align">Edit</th>
                      <th width="50px" className="center-align">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.uFiltered.map((u) =>
                      <tr key={u.ID}>
                        <td>{u.MAIL}</td>
                        <td>{u.INFO}</td>
                        <td className="center-align">{u.ADMIN=="true" ? <i className="material-icons">check</i> : ""}</td>
                        <td className="center-align">
                          <button onClick={this.handleModalClick} className="modal-trigger btn-floating btn-small btn-flat grey"  href="#modal-user">
                            <i className="material-icons" value={u.ID}>edit</i>
                          </button>
                        </td>
                        <td className="center-align">
                          <button className="dropdown-trigger btn-floating btn-small btn-flat grey" data-target={`m-delete-${u.ID}`}>
                            <i className="material-icons">delete</i>
                          </button>
                          <div id={`m-delete-${u.ID}`} className='dropdown-content'>
                            <p className="center-align">Really?</p>
                            <ul>
                              <li><a>No</a></li>
                              <li><button value={u.ID} className="btn-flat" onClick={this.handleDelete}>Yes</button></li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  
                </table>
              </div>
              <ModalUser usrs={this.state.usrs} values={this.state.values}/>
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}

export default Users;

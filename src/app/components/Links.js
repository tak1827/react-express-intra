import React from 'react';
import ModalLink from './modal/ModalLink.js';
import U from './../util.js';

class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [],
    }
    this.format = this.format.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount () {
    // Get all links
    const url = '/api/links';
    U.fetchGet(url).then((data) => {
      this.setState({links: this.format(data.links)});
      M.Collapsible.init(document.querySelector('#area-links .collapsible'), {accordion: false});
    });

    // Receive links update through websocket
    this.props.WS.on('links', (data) => {
      if (!data) { return; }
      console.log(data);
      let links = this.state.links;
      if (data.type == 'new') {
        this.setState({links: this.format([data.link])});
      } else if (data.type == 'delete') {
        this.setState({links: this.format([],data.id)});
      } else if (data.type == 'update') {
        this.setState({links: this.format([data.link])});
      }
      this.setState({links: links});
    });
  }

  handleDelete(e) {
    const url = '/api/link/' + e.target.value;
    U.fetchDelete(url).then((data) => {
      M.toast({html: U.createToastHtml("Success!", "success"), displayLength: 1000});
    });   
  }

  handleModalClick(e) {
    const id = e.target.attributes[1].nodeValue;
    let selected;
    this.state.links.some((category) => { 
      selected = category.links.filter((link) => {return link.ID == id ? true : false});
      if (selected.length != 0) { return true; }
    });
    const d = document;
    d.querySelector('#modal-link [name="category"]').value = selected.length == 0 ? "" : selected[0].CATEGORY;
    d.querySelector('#modal-link [name="name"]').value = selected.length == 0 ? "" : selected[0].NAME;
    d.querySelector('#modal-link [name="path"]').value = selected.length == 0 ? "" : selected[0].PATH;
    d.querySelector('#modal-link [type="submit"]').value = selected.length == 0 ? "" : id;
  }

  format(arr, id) {
    let formed = this.state.links;
    arr.forEach((item) => {
      let matchIndex;
      formed.some((l, i) => { 
        if (l.category && l.category == item.CATEGORY) {
          matchIndex = i;
          return true;
        }
      });
      if (matchIndex != undefined) {
        let match;
        formed[matchIndex].links.some((l, i) => {
          if (l.ID == item.ID) {
            match = i;
            return true;
          }
        });
        if (match != undefined) {
          formed[matchIndex].links[match] = item;
        } else {
          formed[matchIndex].links.push(item);
        }
      } else {
        formed.push({category: item.CATEGORY, links:[item]});
      }
    });
    if (id) {
      let match;
      formed.some((l, i) => {
        formed[i].links.some((_l, _i) => {
          if (_l.ID == id) {
            formed[i].links.splice(_i, 1);
            return true;
          }
        });
      });
    }
    return formed;
  }

  render() {
    return (
    	<div id="area-links"  className="col s12 m4">
        <div className="card">
          <div className="card-image">
            <img src="images/links.png"/>
            <span className="card-title">Links</span>
          </div>
          <button onClick={this.handleModalClick} className="btn-floating halfway-fab waves-effect waves-light indigo modal-trigger" href="#modal-link"><i className="material-icons" value="new">add</i>
          </button>
          <div className="card-content">
            <ul className="collapsible expandable z-depth-0">
              {this.state.links.map((lc) =>
                <li key={lc.category} className="active">
                  <div className="collapsible-header">{lc.category}</div>
                  <div className="collapsible-body">
                    {lc.links.map((l) =>
                      <div key={l.ID} className="row">
                        <div className="col s10">
                          <p><a href={l.PATH}>{l.NAME}</a></p>
                        </div>
                        <div className="col s2">
                          <button onClick={this.handleModalClick} className='modal-trigger btn-floating btn-flat btn-small grey center-align' href="#modal-link">
                            <i className="material-icons" value={l.ID}>edit</i>
                          </button>
                          <a className="dropdown-trigger btn-floating btn-flat btn-small grey center-align" data-target={"l-delete-" + l.ID}>
                            <i className="material-icons">delete</i>
                          </a>
                          <div id={"l-delete-" + l.ID} className='dropdown-content'>
                            <p className="center-align">Really?</p>
                            <ul>
                              <li><a>No</a></li>
                              <li><button value={l.ID} className="btn-flat" onClick={this.handleDelete}>Yes</button></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
        <ModalLink links={this.state.links}/>
      </div> 
    );
  }
}

export default Links;

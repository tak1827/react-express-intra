import React from 'react';
import ModalLink from './modal/ModalLink.js';

class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: []
    }
  }

  componentDidMount () {
    // Get all links
    const url = '/api/links';
    fetch(url, {
      method: 'get'
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw new Error(response.statusText || response.status);
      }
    }).then((data) => {
      console.log(data);
      let preLink;
      let linksFormed = [];
      let categories = []
      data.links.forEach((link) => {
        if (!preLink || link.category != preLink.category) {
          linksFormed.push({category: link.category, links: []});
          categories.push(link.category);
        }
        linksFormed[linksFormed.length-1]["links"].push(link);
        preLink = link;
      });
      this.setState({links: linksFormed});
      const elm = document.querySelector('#area-links .collapsible');
      M.Collapsible.init(elm, {accordion: false});
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
    	<div id="area-links"  className="col s12 m6">
        <div className="card">
          <div className="card-image">
            <img src="images/links.png"/>
            <span className="card-title">Links</span>
          </div>
          <a className="btn-floating halfway-fab waves-effect waves-light indigo modal-trigger" href="#modal-link"><i className="material-icons">add</i></a>
          <div className="card-content">
            <CategoryList links={this.state.links}/>
          </div>
        </div>
        <ModalLink links={this.state.links}/>
      </div> 
    );
  }
}

function LinkList(props) {
  const listItems = props.links.map((item) =>
    <p key={item.id}><a href={item.path}>{item.name}</a></p>
  );
  return (
    <div className="collapsible-body">{listItems}</div>
  );
}

function CategoryList(props) {
  // function handleClick(e) {
  //   M.Collapsible.init(document.querySelector('#area-links .collapsible'),{accordion: false});
  // };
  const listItems = props.links.map((item) =>
    <li key={item["links"][0]["id"]} className="active">
      <div className="collapsible-header">{item.category}</div>
      <LinkList links={item.links}/>
    </li>
  );
  return (
    // <ul className="collapsible z-depth-0" onClick={handleClick}>{listItems}</ul>
    <ul className="collapsible z-depth-0">{listItems}</ul>
  );
}

export default Links;

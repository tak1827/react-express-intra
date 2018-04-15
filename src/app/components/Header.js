import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <header>
        <nav className="top-nav">
          <div className="row">
            <div className="col s12 m10 offset-m1 grey-text">
              <h1>Intranet</h1>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Login from './components/Login.js';
import Intra from './components/Intra.js';

class App extends React.Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/intra" component={Intra}/>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

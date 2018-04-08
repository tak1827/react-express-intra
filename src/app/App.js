import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import Login from './components/Login.js';
import Intra from './components/Intra.js';

class App extends React.Component {
	componentWillMount() {
    // const script = document.createElement("script");
    // script.src = "js/materialize.min.js";
    // script.async = false;
    // document.body.appendChild(script);
  }

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

// <Comp isLoggedIn={this.state.user.login} user={this.state.user}/>
// function Comp(props) {
//   const isLoggedIn = props.isLoggedIn;
//   if (isLoggedIn) {
//     return <Intra appUser={props.user}/>;
//   }
//   return <Login appUser={props.user}/>;
// }


ReactDOM.render(<App/>, document.getElementById('app'));

import React from 'react';
import querystring from 'querystring';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usr: {
        mail:'',
        pass: ''
      },
      mailValCls: "validate",
      passValCls: "validate"
    }
    this.handleMailChange = this.handleMailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }

  componentDidMount () {
    const query = querystring.parse(window.location.search.slice(1));
    let usr = this.state.usr;
    if (query.mail) { usr.mail = query.mail; } 
    if (query.pass) { usr.pass = query.pass; }
    this.setState({usr});
    if (query.isUsr && query.isUsr == 'false') {
      this.setState({mailValCls: "validate invalid", passValCls: "validate invalid"});
    } else if (query.isUsr && query.isUsr == 'true') {
      this.setState({passValCls: "validate invalid"});
    }
  }

  handleMailChange(e) {
    let usr = this.state.usr;
    usr.mail = e.target.value;
    this.setState({usr});
  }

  handlePassChange(e) {
    let usr = this.state.usr;
    usr.pass = e.target.value;
    this.setState({usr});
  }

  render() {
    return (
      <main id="screen-login">
        <center>
          <div id="area-login" className="container">
            <div className="z-depth-5 grey lighten-4 inner">
              <h5 className="black-text">Please, login into your account</h5>
              {this.props.user}
              <form className="col s12" method="post" action='/login'>
                <div className="row">
                  <div className="input-field col s12">
                    <i className="material-icons prefix">account_circle</i>
                    <input className={this.state.mailValCls} type="email" name="mail" value={this.state.usr.mail} onChange={this.handleMailChange}/>
                    <label htmlFor="email">Enter your email</label>
                    <span className="helper-text" data-error="Invalid" data-success=""></span>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <i className="material-icons prefix">lock</i>
                    <input className={this.state.passValCls} type="password" name="pass" value={this.state.usr.pass} onChange={this.handlePassChange}/>
                    <label htmlFor="password">Enter your password</label>
                    <span className="helper-text" data-error="Invalid" data-success=""></span>
                  </div>

                </div>
                <br/>
                <center>
                  <div className="row">
                    <button type="submit" name="btn-login" className="col s12 btn btn-large waves-effect grey">Login</button>
                  </div>
                </center>
              </form>

            </div>

            <video autoPlay loop poster="/images/img_top_mainVI.jpg">
              <source src="/images/newPTtopmoviever2.0small2.mp4" type="video/mp4"/>
            </video>

          </div>

        </center>
      </main>
    );
  }
}

export default Login;

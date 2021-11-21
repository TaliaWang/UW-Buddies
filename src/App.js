/*global chrome*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import EmailVerification from './components/EmailVerification.js';

import './App.css';
import firebase from './firebase.js';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoaded: false,
      showLogin: true,
      user: null,
    }
  }

  authListener(){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.setState({
        user: user,
        isLoaded: true
      });
      // TODO: fire on page reload
      chrome.runtime.sendMessage({type: 'updateUser', user: user}, function(response) {
          console.log(response);
      });
    });
  }

  componentDidMount(){
    this.authListener();
  }

  render(){
    return (
      <div className="App">
        {this.state.isLoaded
          ?
            <Router>
                {this.state.user == null 
                  ? <Redirect to="/login"/>
                  : (this.state.user.emailVerified? <Redirect to="/dashboard"/> : <Redirect to="/emailVerification"/>) // TODO: emailVerification instead of login
                }
              <Switch>
                <Route exact path = "/login" render={(props) => <Login/>}/>
                <Route exact path = "/dashboard" render={(props) => <Dashboard/>}/>
                <Route exact path = "/emailVerification" render={(props) => <EmailVerification/>}/>
              </Switch>
            </Router>
          :   
            <div>
              <p>Loading...</p>
            </div>

        } 
      </div>
    );
  }
}

export default App;

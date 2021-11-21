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
      // TODO: fire on page reload?
      chrome.runtime.sendMessage({type: 'updateUser', user: user}, function(response) {
          console.log(response);
      });
    });
  }

  updateSubjects(subjects){
    
  }

  componentDidMount(){
    this.authListener();

    // listen for subject data passed from webpage, TODO: fire on page reload?
    chrome.runtime.onMessage.addListener(function updateSubjects(request, sender, sendResponse){
      if (request.type == 'updateUser'){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {type: 'updateUser', user: request.user});
          });
      }
      else if (request.type == 'updateSubjects'){
        console.log("REQUEST SUBJECTS: " + request.subjects);
        updateSubjects(request.subjects);
      }
      sendResponse("response subjects:" + request.subjects);
    });
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

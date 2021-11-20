import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';

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
            // TODO: routing not working
            <Router>
                {this.state.user == null 
                  ? <Redirect to="/login"/>
                  : (this.state.user.emailVerified? <Redirect to="/dashboard"/> : <Redirect to="/login"/>) // TODO: emailVerification instead of login
                }
              <Switch>
                <Route exact path = "/login" render={(props) => <Login/>}/>
                <Route exact path = "/dashboard" render={(props) => <Dashboard/>}/>
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

import React, {Component} from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Login from './components/Login.js';

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
            /*<BrowserRouter>
              {this.state.user == null 
                ? <Link to="login"></Link>
                : (this.state.user.emailVerified? <Link to="login"></Link> : <Link to="login"></Link>) // TODO: dashboard, emailVerification
              }
              <Routes>
                <Route exact path = "login" element={<Login/>}/>
              </Routes>
            </BrowserRouter>*/
            <Login/>
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

/*global chrome*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import EmailVerification from './components/EmailVerification.js';

import './App.css';
import firebaseApp from './firebase.js';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {getFirestore, doc, setDoc, updateDoc, collection, getDocs, query} from 'firebase/firestore';

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
    onAuthStateChanged(auth, async (user) => {
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

  async componentDidMount(){
    this.authListener();

    // listen for subject data passed from webpage, TODO: fire on page reload?
    chrome.runtime.onMessage.addListener(function updateSubjects(request, sender, sendResponse){
      if (request.type == 'updateUser'){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {type: 'updateUser', user: request.user});
          });
      }
      // TODO: would have to run this in the app once at the beginning of each term to populate db with all courses/subjects for the term
      /*else if (request.type == 'updateSubjects'){
        // update subjects in db
        var db = getFirestore(firebaseApp);
        for (var i = 0; i < request.subjects.length; ++i){
          //console.log("SUBJECT: " + request.subjects[i])
          setDoc(doc(db, "subjects", request.subjects[i]), {
            subject: request.subjects[i],
            users: "defaultuser@default.com",
          }, {
              merge: true
          });
        }
      }*/
      sendResponse("response subjects:" + request.subjects);
    });

    // update number of buddies
    var db = getFirestore(firebaseApp);
    const querySnapshot = await getDocs(query(collection(db, "subjects")));
    var subjects = []
    querySnapshot.forEach(async (doc) => {
      console.log(doc.data());
      console.log(doc.data().subject);
      var users = doc.data().users.split(" ");
      console.log(users);
      subjects.push({subject: doc.data().subject, users: users});
    });
    alert("SUBJECTS: " + JSON.stringify(subjects));
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'updateBuddies', subjects: subjects});
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

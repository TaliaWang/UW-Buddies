/*global chrome*/
import React, { Component } from 'react';

import firebaseApp from '../firebase.js';
import {getAuth, signOut} from 'firebase/auth';
import './css/style.css'

class Dashboard extends Component{

    constructor(props){
        super(props);
        const auth = getAuth();
        this.state = {
            name: auth.currentUser.displayName,
        }
    }

    backToLogin(){
        const auth = getAuth();
        signOut(auth);
    }

    render(){
        return(
            <div>
                <h1>Welcome, {this.state.name}</h1>
                <button className='startPageButtons' onClick={this.backToLogin.bind(this)}>Sign Out</button>
            </div>
        );
    }
}

export default Dashboard;

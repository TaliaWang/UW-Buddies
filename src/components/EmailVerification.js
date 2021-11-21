/*global chrome*/
import React, { Component } from 'react';

import firebase from '../firebase.js';
import {getAuth, signOut, sendEmailVerification} from 'firebase/auth';
import './css/style.css'

class EmailVerification extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    backToLogin(){
        const auth = getAuth();
        signOut(auth);
    }

    resendEmail(){
        const auth = getAuth();
        sendEmailVerification(auth.currentUser)
        .then(function(){
            alert("Verification email sent!");
        })
        .catch(function(error){
            if (error.code == "auth/too-many-requests"){
                alert("Oops! For security reasons, please wait a minute or two before resending a verification email.")
            }
            else{
                alert(error);
            }
        });
    }

    render(){
      return(
        <div>
            <div>
              <h1>Almost done!</h1>
              <p className='introText'>Please check your email to verify <br /> your account.</p>
              <button className= 'startPageButtons' onClick={this.resendEmail.bind(this)}>Resend verification email</button>
              <button className= 'startPageButtons' onClick={this.backToLogin.bind(this)}>Go back to login</button>
            </div>
        </div>
      );
    }
  }

  export default EmailVerification;

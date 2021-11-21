/*global chrome*/
import React, { Component } from 'react';

import firebase from '../firebase.js';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, getIdToken, updateProfile} from 'firebase/auth';

class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            showIntroPage: true,
            isLogin: true,
            text: "Log In",
            email: "",
            password: "",
            name: "",
        }
    }

    changeLogInSignUp(){
        if (this.state.isLogin){
            this.setState({
                isLogin: false,
                text: "Sign Up",
                email: "",
                password: ""
            })
        }
        else{
            this.setState({
                isLogin: true,
                text: "Log In",
                email: "",
                password: ""
            })
        }
    }

    emailChange(e){
        this.setState({
            email: e.target.value
        });
    }

    passwordChange(e){
        this.setState({
            password: e.target.value
        });
    }

    nameChange(e){
        this.setState({
            name: e.target.value
        });
    }

    toggleShowIntroPage(e){
        if (e.target.id == 'login'){
            this.setState({
                showIntroPage: false
            });
        }
        else if (e.target.id == 'createAccount'){
            this.setState({
                showIntroPage: false,
                isLogin: false,
                text: 'Sign Up'
            });
        }
    }

    handleLoginSignUp(e){
    e.preventDefault();
        if (this.state.isLogin){
            // log in
            if (this.state.email == "" || this.state.password == ""){
                alert("Please enter an email and password.");
            }
            else{
                const auth = getAuth();
                signInWithEmailAndPassword(auth, this.state.email, this.state.password)
                .then(()=>{
                    chrome.runtime.sendMessage({type: 'updateUser', user: auth.currentUser}, function(response) {
                        console.log(response);
                    });
                })
                .catch(error => {
                    alert(error.code + ": " + error.message);
                });
            }
        }
        else{
            // sign up
            if (this.state.email == "" || this.state.password == "" || this.state.name == ""){
                alert("Please enter an email, password, and name.");
            }
            else{
                const auth = getAuth();
                createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
                .then(result =>{
                    updateProfile(auth.currentUser,{
                        displayName: this.state.name
                    })
                })
                .then(result =>{
                    sendEmailVerification(auth.currentUser)
                    .then(()=>{
                        alert("Confirmation email sent!");
                    })
                    .catch(function(error){
                        alert(error);
                    });
                })
                .then(result=>{
                    this.setState({
                        email: "",
                        password: ""
                    });
                })
                .catch(error => {
                    alert(error.code + ": " + error.message);
                });
            }
        }
    }

    render(){
        return(
            <div>
                {this.state.showIntroPage
                ?
                    <div className='introContainer'>
                        <h1>UW Buddies</h1>
                        <h3>A course selection tool to help you find friends in all of your courses</h3>
                        <button id='login' onClick={this.toggleShowIntroPage.bind(this)}>Log In</button>
                        <button id='createAccount' onClick={this.toggleShowIntroPage.bind(this)}>Sign Up</button>
                    </div>
                :
                    <div className='logInSignUpContainer'>
                        <form onSubmit={this.handleLoginSignUp.bind(this)}>
                            {this.state.isLogin
                                ? <p>Nice to see you again! Please log in below:</p>
                                : <p>Welcome! Please sign in below:</p>
                            }
                            <input type='text' value={this.state.email} onChange={this.emailChange.bind(this)} placeholder="Email"/>
                            <input type='text' value={this.state.password} onChange={this.passwordChange.bind(this)} placeholder="Password"/>
                            {this.state.isLogin
                                ? null
                                : <input type='text' value={this.state.name} onChange={this.nameChange.bind(this)} placeholder="Full Name"/>
                            }
                            <button type='submit'>Submit</button>
                        </form>
                        <button onClick={this.changeLogInSignUp.bind(this)}>
                            {this.state.isLogin? 'Create an account' : 'Aready have an account?'}
                        </button>
                    </div>
                }
            </div>
        );
    }
}

export default Login;
import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

//import { connect } from "react-redux";
//import {BrowserRouter} from "react-router-dom"

export default class login extends Component{
    constructor(props){
        super(props);
        this.state = {
            userNameInput:''
        }
    

    }

    updateUsername(val){
        this.setState({userNameInput:val})
        console.log(this.state.userNameInput)
    }
    setUsername(){
        console.log(this.state.userNameInput)
         axios.put("/api/setBTS", this.state).then(response =>{
             console.log('redirect to home')
             window.location.href = "http://localhost:3000/";

         })
    }

    render(){
        console.log(process.env)
        return(
            <div>
                <div className="login">
                <Link to="/">
                <button className="headerbutton">Home</button>
                </Link>
                <button className="headerbutton">Account</button>
                <a href={process.env.REACT_APP_LOGOUT}>
                <button className="headerbutton">Logout</button>
                </a>
                </div>


                    <input name="BTSusername" onChange={(e) => {this.updateUsername(e.target.value)}}></input>
                    {/* <a href={process.env.REACT_APP_LOGIN}> */}
                    <button name="enter username" onClick={() => {this.setUsername()}}>enter</button>
                {/* </a> */}
            </div>
        )
    }
}

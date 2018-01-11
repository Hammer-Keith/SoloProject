import React, {Component} from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import {BrowserRouter} from "react-router-dom"

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
            this.props.history.push('/')
        
         })
    }

    render(){
        console.log(process.env)
        return(
            <div>
                    <input name="BTSusername" onChange={(e) => {this.updateUsername(e.target.value)}}></input>
                    {/* <a href={process.env.REACT_APP_LOGIN}> */}
                    <button name="enter username" onClick={() => {this.setUsername()}}>enter</button>
                {/* </a> */}
            </div>
        )
    }
}

import React, {Component} from 'react';

export default class login extends Component{
    // constructor(props){
    //     super(props)
    // }
    render(){
        console.log(process.env)
        return(
            <div>
                <a href={process.env.REACT_APP_LOGIN}>
                    <button>Login</button>
                </a>
            </div>
        )
    }
}
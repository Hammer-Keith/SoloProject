import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios"
import {Link} from 'react-router-dom'

import { retrieveUser } from "../../ducks/user";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user:{},
      balance: {}
      
    }
   }
  componentDidMount(req, res, next){
      this.props.retrieveUser()
      
      console.log('bts account')
      console.log(this.props.user)
      console.log(this.props.user.bts_account)
      for(var i = 0;i<100000;i++){
      setTimeout(() => {
      if(this.props.isLoading===false){
      if(this.props.user.bts_account){
        this.setState({user:this.props.user})
        console.log('response')
        axios.get(`/api/getbal/${this.state.user.id}`).then(response => {
          console.log('response.then')
          console.log(response.data)
        this.setState({balance:response.data})
    
        }).catch(console.log)
      }
    }
    
    }, 20);
    break
  }
  }
   getBalance(req,res,next){
    axios.get(`/api/getbal/${this.state.user.id}`).then(response => {
    console.log(response.data)
    this.setState({balance:response.data})

     }).catch(console.log)
   }


  render() {
      console.log(this.props);
      let loginButton = null
      let BTSButton = null
       if(!this.state.user.name){
        console.log("props.user")
        console.log(this.state.user)

        loginButton =         
        <a href={process.env.REACT_APP_LOGIN}>
            <button className="headerbutton">Login</button>
        </a>
       }
       else{
        loginButton =         
        <a href={process.env.REACT_APP_LOGOUT}>
            <button className="headerbutton">Logout</button>
        </a>
       }

if(this.state.user){
      if(this.state.user.name){
        BTSButton =         <Link to="/EnterBTS">
        <button className="headerbutton">Account</button>
    </Link>
      }
    }
    else{
      console.log('retrieveUser again')
      this.state.retrieveUser()
    }
    
      if(Object.keys(this.state.balance).length !== 0){
        console.log('current balance')
        console.log(this.state.balance)
        console.log(Object.keys(this.state.balance))
      }

    return (
      <div>
        <div className="login">

        <button className="headerbutton">Home</button>

        {
          BTSButton
        }
        {
         loginButton
        }

        </div>
        <div>

          <h1>Welcome To The Home Page</h1>
        </div>
       
          <div>{this.state.user && <div>{this.state.user.name}</div>}</div>
          
        {/* {balance} */}



        <div className="table">
          {/* <p>{
          JSON.stringify(this.state.balance)
        }</p> */}
{Object.keys(this.state.balance).length>0 &&
 <table className="dataTab">
  <thead>
  <tr>
    <th>Currency</th>
    <th>Amount</th>
  </tr>
  </thead>
  <tbody>

  {
    Object.keys(this.state.balance).map((val,i) =>(
  <tr>
    <td>{val}</td>
    <td>{
      this.state.balance[val].balance
      }</td>
  </tr>
    ))
  } 
  </tbody>
</table>
}
        </div>
        </div>
    );
  }
}

const mapStateToProps = state => state;
export default connect(mapStateToProps, {retrieveUser})(Home);
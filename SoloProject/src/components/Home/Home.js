import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios"
import {Link} from 'react-router-dom'

import { retrieveUser } from "../../ducks/user";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: {}
    }

   }



  componentDidMount(req, res, next){
      this.props.retrieveUser();
      // axios.get(`/api/getbal/${this.props.user.id}`).then(response => {
      //   console.log(response.data)
      // this.setState({balance:response.data})
      // }).catch(console.log)
  }
  getBalance(req,res,next){
    this.props.retrieveUser();
    axios.get(`/api/getbal/${this.props.user.id}`).then(response => {
      console.log(response.data)
    this.setState({balance:response.data})
    }).catch(console.log)
  }


  render() {
      console.log(this.props);
      let loginButton = null
      if(this.props.user){
        loginButton = <Link to="/login">
        <button>Login Page</button>
        </Link>
      }
      else{
        loginButton = <h1>{this.state.balance}</h1>
      }

    return (
      <div>
        <div>
          <h1>Welcome To The Home Page</h1>
        </div>
        {
         loginButton
        }
          <div>{this.props.user && <div>{this.props.user.name}</div>}</div>

        {this.props.user && <div>{this.props.user.id}</div>}
        <Link to="/EnterBTS">
            <button>BTSAccount</button>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => state;
export default connect(mapStateToProps, {retrieveUser})(Home);
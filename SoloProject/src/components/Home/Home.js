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


   updateBalance(data){
    this.setState({balance:data})
  }

  componentDidMount(req, res, next){
      this.props.retrieveUser();
      axios.get(`/api/getbal/enki`).then(response => {
      this.updateBalance(response.data)
      }).catch(console.log)
  }



  render() {
      console.log(this.props);
    return (
      <div>
        <div>
          <h1>Welcome To The Home Page</h1>
        </div>
        {!this.props.user && (
          <div>
            <h1>{this.state.balance}</h1>
            <Link to="/login">
            <button>Login Page</button>
            </Link>
          </div>
        )}
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
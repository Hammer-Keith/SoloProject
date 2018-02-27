import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { retrieveUser } from "../../ducks/user";

export default class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameInput: ""
    };
  }

  updateUsername(val) {
    this.setState({ userNameInput: val });
    console.log(this.state.userNameInput);
  }
  setUsername() {
    console.log(this.state.userNameInput);
    axios.put("/api/setBTS", this.state).then(response => {
      console.log("redirect to home");
      console.log(response.data);
    });
  }

  render() {
    return (
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
        <h1 className="BTSHEADER">Enter your BitShares Username</h1>
        <div className="btsButtons">
          <input
            name="BTSusername"
            className="enterInput"
            onChange={e => {
              this.updateUsername(e.target.value);
            }}
          />
          <button
            name="enter username"
            className="enterButton"
            onClick={() => {
              this.setUsername();
            }}
          >
            enter
          </button>
          <div>
            <a href={process.env.REACT_APP_DELETE}>
              <button className="deleteAccButt">Delete Account</button>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

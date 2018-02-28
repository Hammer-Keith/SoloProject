import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

import { retrieveUser } from "../../ducks/user";
import { newBTS } from "../../ducks/user";
import logo from "../../logo.png";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: {},
      value: [],
      btsVal: 0,
      balanceloading: false,
      totalVal: [],
      accountVal: 0
    };
  }
  componentDidMount(req, res, next) {
    this.props.retrieveUser();
    console.log(this.props.user);
    axios.get(`/api/getBTSVal`).then(response => {
      this.setState({ btsVal: response.data });
      if (this.props.user.name) {
        console.log("if statement checks out");
        newBTS();
      }
    });
  }
  setTotVal() {
    if (this.state.totalVal.length === 0) {
      var ans = [];
      var kees = Object.keys(this.state.balance);

      this.state.value.map((val, i) => {
        if (kees[i] === "USD") {
          ans[i] = val * this.state.balance[kees[i]].balance;
        } else {
          ans[i] =
            val * this.state.btsVal * this.state.balance[kees[i]].balance;
        }
      });
      this.setState({ totalVal: ans });

      if (ans.length > 0) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        var x = 0;
        for (var i = 0; i < ans.length; i++) {
          x += ans[i];
        }
        this.setState({ accountVal: x });
      }
    }
  }

  render() {
    let loginButton = null;
    let BTSButton = null;
    let welcomeText = null;
    let values = [];
    let accVal = 0;

    if (!this.props.user.name) {
      loginButton = (
        <a href={process.env.REACT_APP_LOGIN}>
          <button className="headerbutton">Login</button>
        </a>
      );
    } else {
      loginButton = (
        <a href={process.env.REACT_APP_LOGOUT}>
          <button className="headerbutton">Logout</button>
        </a>
      );
    }

    if (this.props.user) {
      if (this.props.user.name) {
        BTSButton = (
          <Link to="/EnterBTS">
            <button className="headerbutton">Account</button>
          </Link>
        );
      }

      if (this.props.user) {
        if (this.props.user.name) {
          welcomeText = <h1>Welcome, {this.props.user.name}!</h1>;
        } else {
          welcomeText = (
            <div>
              <h1>Log In or Sign Up to get started</h1>

              <img src={logo} className="bigBanner" alt="logo" />
            </div>
          );
        }
      } else {
        retrieveUser();
      }
    }

    if (this) {
      if (this.props.user) {
        if (this.props.user.bts_account) {
          if (
            Object.keys(this.state.balance).length <= 0 &&
            this.state.balanceloading === false
          ) {
            this.setState({ balanceloading: true });
            axios
              .get(`/api/getbal/${this.props.user.bts_account}`)
              .then(response => {
                console.log(response);
                var accum = 0;
                response.data.map((val, i) => {
                  console.log(val);
                  accum += val.ammount * val.price * this.state.btsVal;
                });
                this.setState({ balance: response.data, accountVal: accum });

                if (Object.keys(response.data).length < 100) {
                  Object.keys(response.data).map((val, i) =>
                    // console.log(val)
                    axios.get(`/api/getvalue/${val}`).then(response => {
                      values[i] = response.data.price;
                      this.setState({ value: values });
                    })
                  );
                }
              });
          }
        }
      }
    }

    return (
      <div className="content">
        <div className="login">
          <button className="headerbutton">Home</button>

          {BTSButton}
          {loginButton}
        </div>
        <div className="welcome">{welcomeText}</div>

        {this.props.user.name && (
          <div className="dataContainer">
            <div className="table">
              {Object.keys(this.state.balance).length === 0 && (
                <h1>Loading...</h1>
              )}
              {Object.keys(this.state.balance).length > 0 && (
                <table className="dataTab">
                  <thead>
                    <tr>
                      <th>Currency</th>
                      <th>Amount</th>
                      <th>Price Per Coin</th>
                      <th>Value of Collection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.balance.map((val, i) => (
                      <tr>
                        <td>{val.ticker}</td>
                        <td>{val.ammount}</td>
                        {
                          <td>
                            ${Math.round(
                              val.price * this.state.btsVal * 100000000
                            ) / 100000000}
                          </td>
                        }
                        {
                          <td>
                            ${Math.round(
                              val.ammount *
                                val.price *
                                this.state.btsVal *
                                100000000
                            ) / 100000000}
                          </td>
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {this.state.balance.length > 0 && (
              <div className="chart">
                <Bar
                  data={{
                    labels: this.state.balance.map((val, i) => {
                      return val.ticker;
                    }),
                    datasets: [
                      {
                        label: "Your Collection Value",
                        data: this.state.balance.map((val, i) => {
                          return (
                            Math.round(
                              val.ammount *
                                val.price *
                                this.state.btsVal *
                                100000000
                            ) / 100000000
                          );
                        }),
                        pointBackgroundColor: "#FFFFFF",
                        backgroundColor: [
                          "#727272",
                          "#f1595f",
                          "#79c36a",
                          "#599ad3",
                          "#f9a65a",
                          "#9e66ab",
                          "#cd7058",
                          "#d77fb3"
                        ],
                        hoverBackgroundColor: [
                          "#727272",
                          "#f1595f",
                          "#79c36a",
                          "#599ad3",
                          "#f9a65a",
                          "#9e66ab",
                          "#cd7058",
                          "#d77fb3"
                        ]
                      }
                    ]
                  }}
                />
              </div>
            )}
          </div>
        )}
        <div className="dataContainer2">
          <div className="table2">
            {this.state.balance.length > 0 && (
              <div className="smallerpls">
                <p className="accountIsWorth">Your account is worth:</p>
                <p className="justLeft">${this.state.accountVal}</p>
                {this.state.balance.map((val, i) => (
                  <div>
                    {val.ticker !== "USD" && (
                      <p className="justLeft">
                        {val.ticker}{" "}
                        {this.state.accountVal / this.state.btsVal * val.price}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {this.state.balance.length > 0 && (
            <div className="chart">
              <Doughnut
                data={{
                  labels: this.state.balance.map((val, i) => {
                    return val.ticker;
                  }),
                  datasets: [
                    {
                      data: this.state.balance.map((val, i) => {
                        return (
                          val.ammount *
                          val.price *
                          this.state.btsVal /
                          this.state.accountVal
                        );
                      }),
                      backgroundColor: [
                        "#727272",
                        "#f1595f",
                        "#79c36a",
                        "#599ad3",
                        "#f9a65a",
                        "#9e66ab",
                        "#cd7058",
                        "#d77fb3"
                      ],
                      hoverBackgroundColor: [
                        "#727272",
                        "#f1595f",
                        "#79c36a",
                        "#599ad3",
                        "#f9a65a",
                        "#9e66ab",
                        "#cd7058",
                        "#d77fb3"
                      ]
                    }
                  ]
                }}
              />
            </div>
          )}
        </div>

        {JSON.stringify(this.props)}
      </div>
    );
  }
}

const mapStateToProps = state => state;
export default connect(mapStateToProps, { retrieveUser })(Home);

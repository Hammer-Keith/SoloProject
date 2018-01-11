
import React, { Component } from 'react';
import axios from "axios";
import logo from './logo.svg';
import './App.css';

import routes from "./routes";

class App extends Component {
 constructor(props){
   super(props);

   this.state = {
     test: null
   };
 }


//  componentDidMount(){
//    axios
//      .get('/api/test')
//      .then(response => this.setState({ test: response.data }))
//      .catch(console.log);

//  }
 render() {
   return (
     <div className="App">
       <header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
       </header>
       {routes}
     </div>
   );
 }
}

export default App;
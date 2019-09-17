import React, { Component } from 'react';
import './App.css';

import UserInput from './UserInput/UserInput';
import UserOutput from './UserOutput/UserOutput';

class App extends Component {
  state = {
    users: [
      {name: "Jack"},
      {name: "Joe"},
      {name: "Mary"}
    ]
  };

  nameValueHandler = (event) => {
    this.setState({
      users:[
        {name: event.target.value},
        {name: "Joe"},
        {name: "Mary"}
      ]
    });
  };
  
  render() {
    return (
      <div className="App">
        <UserInput name={this.state.users[0].name} changed={this.nameValueHandler} />
        <UserOutput name={this.state.users[0].name} />
        <UserOutput name={this.state.users[1].name} />
        <UserOutput name={this.state.users[2].name} />
      </div>
    );
  }
}

export default App;

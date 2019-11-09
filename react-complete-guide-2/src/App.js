import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  state = {
    persons: [
      {name: 'Max', age: 27},
      {name: 'Jim', age: 22},
      {name: 'Jone', age: 33}
    ]
  }
  switchNameHandler = () => {
    this.setState({persons:[
      {name: 'Maximilian', age: 29},
      {name: 'Jim2', age: 22},
      {name: 'Jone', age: 33}
    ]})
  }
  render() {
    return (
      <div className="App">
        <h1>Hi, I'm react app</h1>
        <button onClick={this.switchNameHandler}>Switch Name</button>
        { 
          this.state.persons.map(p => 
            <Person name={p.name} age={p.age} />
          )
        }

        <Person name="Jack" age="42">My Hobbies: Racing</Person>
        <Person name="Bill" age="22" />
      </div>
    );
  }
  // return React.createElement('div', {className: 'App'}, 
  //           React.createElement('h1', null, 'Hi, i\'m react app'))
}

export default App;
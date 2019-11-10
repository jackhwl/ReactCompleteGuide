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
    ],
    me: {name: 'Jack', age: 42}
  }
  switchNameHandler = () => {
    this.setState({persons:[
      {name: 'Maximilian', age: 29},
      {name: 'Jim2', age: 22},
      {name: 'Jone', age: 33}
    ]})
  }

  nameChangedHandler = (event) => {
    this.setState({me: {name: event.target.value, age: 33}
    })
  }
  render() {
    const style = {
      backgroundColor: 'white',
      font: 'inherit',
      border: '1px solid lue',
      padding: '8px',
      cursor: 'pointer'
    }
    return (
      <div className="App">
        <h1>Hi, I'm react app</h1>
        <button style={style} onClick={this.switchNameHandler}>Switch Name</button>
        { 
          this.state.persons.map(p => 
            <Person name={p.name} age={p.age} key={p.name} />
          )
        }

        <Person name={this.state.me.name} age={this.state.me.age} 
        changed={this.nameChangedHandler} 
        click={this.switchNameHandler}>My Hobbies: Racing</Person>
      </div>
    );
  }
  // return React.createElement('div', {className: 'App'}, 
  //           React.createElement('h1', null, 'Hi, i\'m react app'))
}

export default App;
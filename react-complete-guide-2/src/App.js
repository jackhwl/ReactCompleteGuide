import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Person from './Person/Person';
import UserInput from './UserInput/UserInput';
import UserOutput from './UserOutput/UserOutput';

class App extends Component {
  state = {
    persons: [
      {id: '1', name: 'Max', age: 27},
      {id: '2', name: 'Jim', age: 22},
      {id: '3', name: 'Jone', age: 33}
    ],
    me: {name: 'Jack', age: 42},
    username: 'Tom',
    showPersons: false
  }
  switchNameHandler = () => {
    this.setState({persons:[
      {id: '1', name: 'Maximilian', age: 29},
      {id: '2', name: 'Jim2', age: 22},
      {id: '3', name: 'Jone', age: 33}
    ]})
  }

  nameChangedHandler = (event) => {
    this.setState({me: {name: event.target.value, age: 33}
    })
  }
  pNameChangeHandler = (event, id) => {
    const pIndex = this.state.persons.findIndex(p => p.id===id);
    const person = {...this.state.persons[pIndex]}
    person.name = event.target.value

    const persons = [...this.state.persons]
    persons[pIndex] = person

    this.setState({ persons })
  }

  usernameChangeHandler = (event) => {
    this.setState({username: event.target.value})
  }

  togglePersonsHandler = () => {
    var newState = !this.state.showPersons;
    this.setState({showPersons: newState})
  }

  deletePersonHandler = (personIndex) => {
    let persons = [...this.state.persons]
    persons.splice(personIndex, 1)
    this.setState({persons})
  }

  render() {
    const style = {
      backgroundColor: 'white',
      font: 'inherit',
      border: '1px solid lue',
      padding: '8px',
      cursor: 'pointer'
    }
    let persons = null
    if (this.state.showPersons){
      persons = (<div>
          {this.state.persons.map((p, index) => 
            <Person name={p.name} age={p.age} key={p.id} 
            changed={(event) => this.pNameChangeHandler(event, p.id)}
            click={()=>this.deletePersonHandler(index)} />
          )}
          <Person name={this.state.me.name} age={this.state.me.age} key="4"
            changed={this.nameChangedHandler} 
            click={this.switchNameHandler}>My Hobbies: Racing</Person>

      </div>) 
    }
    return (
      <div className="App">
        <UserInput nameChange={this.usernameChangeHandler} username={this.state.username}></UserInput>
        <UserOutput username={this.state.username}></UserOutput>
        <UserOutput username={this.state.username}></UserOutput>
        
        <button style={style} onClick={this.togglePersonsHandler}>toggle persons</button>
        { persons }
      </div>
    );
  }
  // return React.createElement('div', {className: 'App'}, 
  //           React.createElement('h1', null, 'Hi, i\'m react app'))
}

export default App;
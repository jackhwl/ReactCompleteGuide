import React, { Component } from 'react';
// import styled from 'styled-components'
import logo from './logo.svg';
import classes from './App.module.css';
import Person from './Person/Person';
import UserInput from './UserInput/UserInput';
import UserOutput from './UserOutput/UserOutput';
import Validation from './Validation/Validation'
import Char from './Char/Char'

class App extends Component {
  state = {
    persons: [
      {id: '1', name: 'Max', age: 27},
      {id: '2', name: 'Jim', age: 22},
      {id: '3', name: 'Jone', age: 33}
    ],
    me: {name: 'Jack', age: 42},
    username: 'Tom',
    showPersons: false,
    a2text: ''
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

  lengthChangeHandler = (event) => {
    this.setState({a2text: event.target.value})
  }

  charClickHandler = (index) => {
    let a2text = this.state.a2text.split('')
    a2text.splice(index,1)
    a2text = a2text.join('')
    this.setState({a2text})
  }

  render() {
    let persons = null
    let btnClass = [classes.Button];
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
      btnClass.push(classes.Red)
    }

    const assignedClasses = []
    if (this.state.persons.length <=2){
      assignedClasses.push(classes.red)
    }
    if (this.state.persons.length <=1){
      assignedClasses.push(classes.bold)
    }
    
    return (
      <div className={classes.App}>
        {/* <ol>
          <li>Assignment 2</li>
          <li>Create an input field (in App component) with a change listener which outputs the length of the entered text below it (e.g. in a paragraph).</li>
          <li>Create a new component (=> ValidationComponent) which receives the text length as a prop</li>
          <li>Inside the ValidationComponent, either output "Text too short" or "Text long enough" depending on the text length (e.g. take 5 as a minimum length)</li>
          <li>Create another component (=> CharComponent) and style it as an inline box (=> display: inline-block, padding: 16px, text-align: center, margin: 16px, border: 1px solid black).</li>
          <li>Render a list of CharComponents where each CharComponent receives a different letter of the entered text (in the initial input field) as a prop.</li>
          <li>When you click a CharComponent, it should be removed from the entered text.</li>
        </ol>
        <p>Hint: Keep in mind that JavaScript strings are basically arrays!</p> */}

        <p className={assignedClasses.join(' ')}>This is really working!</p>

        <input type="text" onChange={this.lengthChangeHandler} value={this.state.a2text} />
        <p></p>{this.state.a2text.length}
        <Validation length={this.state.a2text.length}></Validation>
        {
          this.state.a2text.split('').map((c, index) =>
            <Char char={c} key={index} click={() => this.charClickHandler(index)}></Char>
            )
        }
        
        <UserInput nameChange={this.usernameChangeHandler} username={this.state.username}></UserInput>
        <UserOutput username={this.state.username}></UserOutput>
        <UserOutput username={this.state.username}></UserOutput>
        
        <button className={btnClass.join(' ')} onClick={this.togglePersonsHandler}>toggle persons</button>
        { persons }
      </div>

    );
  }
  // return React.createElement('div', {className: 'App'}, 
  //           React.createElement('h1', null, 'Hi, i\'m react app'))
}

export default App;
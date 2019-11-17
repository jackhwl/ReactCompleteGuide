import React, { Component } from 'react';
import classes from './App.module.css';
import Persons from '../components/Persons/Persons';
import Cockpit from '../components/Cockpit/Cockpit'
// import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
// import Assignment2 from '../components/Assignment2/Assignment2'

class App extends Component {
  constructor(props){
    super(props)
    console.log('[App.js] constructor')
  }
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

  static getDerivedStateFromProps(props, state){
    console.log('[App.js] getDerivedStateFromProps', props)
    return state;
  }

  // componentWillMount() {
  //   console.log('[App.js] componentWillMount')
  // }

  componentDidMount() {
    console.log('[App.js] componentDidMount')
  }

  switchNameHandler = () => {
    this.setState({persons:[
      {id: '1', name: 'Maximilian', age: 29},
      {id: '2', name: 'Jim2', age: 22},
      {id: '3', name: 'Jone', age: 33}
    ]})
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
    console.log('[App.js] render')
    let persons = null

    if (this.state.showPersons){
      persons = <Persons 
        persons={this.state.persons} 
        clicked={this.deletePersonHandler} 
        changed={this.pNameChangeHandler} />
    }

    return (
      <div className={classes.App}>
        {/* <Assignment2 username={this.state.username} 
          clicked={this.charClickHandler}
          changed={this.lengthChangeHandler}
          nameChange={this.usernameChangeHandler}
          a2text={this.state.a2text}/> */}
        <Cockpit showPersons={this.state.showPersons}
          title = {this.props.name}
          persons={this.state.persons} 
          clicked={this.togglePersonsHandler} />
        {persons}      
      </div>
    );
  }
  // return React.createElement('div', {className: 'App'}, 
  //           React.createElement('h1', null, 'Hi, i\'m react app'))
}

export default App;
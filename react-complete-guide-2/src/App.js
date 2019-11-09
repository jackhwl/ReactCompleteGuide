import React, { useState } from 'react';
import './App.css';
import Person from './Person/Person';

const App = props =>  {
  const [personState, setPersonState] = useState({
    persons: [
      {name: 'Max', age: 27},
      {name: 'Jim', age: 22},
      {name: 'Jone', age: 33}
    ]
  })

  const switchNameHandler = () => {
    setPersonState({
      persons:[
        {name: 'Maximilian', age: 29},
        {name: 'Jim2', age: 22},
        {name: 'Jone', age: 33}
      ]})
  }

  return (
      <div className="App">
        <h1>Hi, I'm react app this is {props.name}</h1>
        <button onClick={switchNameHandler}>Switch Name</button>
        { 
          personState.persons.map(p => 
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

export default App;
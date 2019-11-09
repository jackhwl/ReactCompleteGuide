import React from 'react';
import logo from './logo.svg';
import './App.css';
import Person from './Person/Person';

function App() {
  return (
    <div className="App">
      <h1>Hi, I'm react app</h1>
      <Person name="Max" age="28" />
      <Person name="Jack" age="42">My Hobbies: Racing</Person>
      <Person name="Bill" age="22" />
    </div>
  );
  // return React.createElement('div', {className: 'App'}, 
  //           React.createElement('h1', null, 'Hi, i\'m react app'))
}

export default App;
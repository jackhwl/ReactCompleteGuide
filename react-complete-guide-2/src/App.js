import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // return (
  //   <div className="App">
  //     <h1>Hi, I'm react app</h1>
  //   </div>
  // );
  return React.createElement('div', {className: 'App'}, 
            React.createElement('h1', null, 'Hi, i\'m react app'))
}

export default App;
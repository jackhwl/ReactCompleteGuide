import React, { Component } from 'react';
import './App.css';
import Validation from './Validation/Validation';
import Char from './Char/Char';

class App extends Component {
  state = {length: 0, chars: []};
  textChangeHandler = (event) => {
    this.setState({length: event.target.value.length,
      chars: event.target.value.split('')});
  }

  charClickedHandler = (index) => {
    const chars = [...this.state.chars];
    chars.splice(index, 1);
    this.setState({chars: chars});
  }

  render() {
    return (
      <div className="App">
        <input type="text" onChange={(event) => this.textChangeHandler(event)} />
        <Validation length={this.state.length} />
        { this.state.chars.map((c, index) => <Char mychar={c} key={index} clicked={() => this.charClickedHandler(index)} /> ) }
      </div>
    );
  }
}

export default App;

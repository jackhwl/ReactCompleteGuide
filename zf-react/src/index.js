import React from 'react'
import ReactDOM from 'react-dom'

class Counter extends React.Component {
    //state = { number: 0 }
    constructor(props) {
        super(props)
        this.state = { number: 0}
    }

    add = (event) => {
        console.log(event)
        this.setState({number: this.state.number + 1})
    }
    add1() {
        this.setState({number: this.state.number + 1})
    }
    render() {
        console.log('render')
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={this.add}>+++ anonymous function</button>
                <button onClick={(event) => this.add1(event)}>+++111 arrow function</button>
                <button onClick={this.add1.bind(this)}>+++ bind</button>
            </div>
        )
    }
}
// let counter = new Counter({name: 'jack'})
// console.log(counter.state, counter.__proto__.state)

ReactDOM.render(<Counter />, document.getElementById('root'))

import React from 'react'
import ReactDOM from 'react-dom'

class Counter extends React.Component {
    //state = { number: 0 }
    constructor(props) {
        super(props)
        this.state = { number: 0}
    }
    render() {
        console.log('render')
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={()=> this.setState({number: this.state.number + 1})}>+++</button>
            </div>
        )
    }
}
// let counter = new Counter({name: 'jack'})
// console.log(counter.state, counter.__proto__.state)

ReactDOM.render(<Counter />, document.getElementById('root'))

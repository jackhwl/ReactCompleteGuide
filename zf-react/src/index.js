import React from 'react'
import ReactDOM from 'react-dom'

class Counter extends React.Component {
    static defaultProps = {
        name: 'jack'
    }
    constructor(props){
        super(props)
        this.state = { count: 0}
        console.log('1. run constructor, set initial state')
    }

    componentWillMount() {
        console.log('2.componentWillMount')
    }

    addHandler = (event) => {
        this.setState({count: this.state.count + 1 })
    }

    // run componentDidMount after v-dom mounted  to real-som, then can get real-dom element
    componentDidMount() {
        console.log('4.componentDidMount')
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('5.shouldComponentUpdate')
        return nextState.count % 3 === 0
    }
    componentWillUpdate() {
        console.log('6.componentWillUpdate')
    }
    componentDidUpdate() {
        console.log('7.componentDidUpdate')
    }
    //render return virtual-dom
    render() {
        console.log('3. render determine the v-dom going to display')
        return (
            <div>
                <p>{this.state.name}</p>
                <p>{this.state.count}</p>
                <button onClick={this.addHandler}>+</button>
            </div>
        )
    }
}

ReactDOM.render(<Counter />, document.getElementById('root'))

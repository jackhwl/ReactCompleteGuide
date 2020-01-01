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
        return true //nextState.count % 3 === 0
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
                <p>{this.props.name}</p>
                <p>{this.state.count}</p>
                <button onClick={this.addHandler}>+</button>
                <ChildCounter count={this.state.count} />
                
            </div>
        )
    }
}

class ChildCounter extends React.Component {
    state = {count: 0, name: 'john'}
    // componentWillReceiveProps(newProps) {
    //     console.log('ChildCounter', newProps)
    // }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('ChildCounter .shouldComponentUpdate')
        return true // nextProps.count % 6 === 0
    }
    // componentWillUpdate() {
    //     console.log('ChildCounter .componentWillUpdate')
    // }
    componentDidUpdate() {
        console.log('ChildCounter .componentDidUpdate')
    }
    componentWillUnmount() {
        console.log('ChildCounter .componentWillUnmount')
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('ChildCounter .getDerivedStateFromProps')
        if (nextProps.count % 2 === 0){
            return { count: nextProps.count * 2 }
        } else {
            return { count: nextProps.count * 3 }            
        }
    }
    render() {
        console.log('childCounter render')
        return (
            <div>
                props count: {this.props.count}
                state count: {this.state.count}
            </div>
        )
    }
}
    
ReactDOM.render(<Counter />, document.getElementById('root'))

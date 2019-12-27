import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// 5
// function Welcome(props) {
//     return (
//         <h1>hello {props.name} <span>world</span></h1>
//     )
// }

// class Welcome extends Component {
//     constructor(props) {
//         super(props)
//     }
//     render() {
//         return (
//             <h1>hello {this.props.name} <span>world</span></h1>
//         )
//     }
// }

// ReactDOM.render(<Welcome name="jack" />, document.getElementById('root'))

//7 pure function

// propeTypes

class Person extends Component {
    static propTypes = {
        //age: PropTypes.number.isRequired,
        gender: PropTypes.oneOf(['male', 'female']).isRequired,
        hobby: PropTypes.arrayOf(PropTypes.string).isRequired,
        position: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        age: function(props, propName, componentName) {
            if (props.age < 18) {
                throw new Error('you are a child')
            }
        }
    }
    render() {
        return (
            <div>
                <span>age: {this.props.age}</span>
                <span>gender: {this.props.gender}</span>
                <span>hobby: {this.props.hobby}</span>
                <span>position: </span>
            </div>
        )
    }
}

let personProps = {
    age: 10,
    gender: 'male',
    hobby: ['basketball', 'football'],
    position: {x: 10, y: 10},
    friends: [{name: 'jone', age: 10}, {name: 'john', age: -20}]
}

ReactDOM.render(<Person {...personProps} />, document.getElementById('root')) 
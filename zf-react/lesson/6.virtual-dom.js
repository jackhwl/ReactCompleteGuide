import React from './react'
import ReactDOM from './react-dom'

//let element = <h1 id="title"><span>hello</span><span>world</span></h1>
// let element = React.createElement('h1', {id: 'title'}, 
//     React.createElement('span', { style: { color: 'red', backgroundColor: 'yellow'}}, 'hello'), 
//     React.createElement('span', { className: 'world', "data-vi-id": 'vi23', id: 'vi-global'}, 'world'))

function Welcome(props) {
    return (
        <h1 id={props.id}>
            <span style={props.style}>hello</span>
            <span className={props.className}>world</span>
        </h1>
    )
}

// class Welcome extends React.Component {
//     constructor(props){
//         super(props)
//     }
//     render() {
//         return (
//             <h1 id={this.props.id}>
//                 <span style={this.props.style}>hello</span>
//                 <span className={this.props.className}>world</span>
//             </h1>
//         )
//     }
// }
let element = React.createElement(Welcome, {id: "title", className: "world", style: { color: 'red', backgroundColor: 'yellow'}})
console.log(element)
ReactDOM.render(element, document.getElementById('root'))
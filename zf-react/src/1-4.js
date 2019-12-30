import React from 'react'
import ReactDOM from 'react-dom'

// 1
// let style = { border: '1px solid red' }
// let element1 = <h1
//         style = {style}
//         id="hello"
//         className="title">hello</h1>
// let element2 = React.createElement("h1", null, "heloo")
// element2 = {type: 'h1', props: {children: 'hello'}}

// 2
// function greeting(name) {
//     return (
//         <div>hello {name}</div>
//     )
// }
// let element1 = greeting('jack')

// let names = ['1', '2', '3']
// let list = []
// for (let i = 0; i< names.length; i++) {
//     list.push(<li key={i}>{names[i]}</li>)
// }
// let element1 = <ul>{list}</ul>


// 3
// let element = (
//     <div>
//         <span>1</span>
//         <span>2</span>
//         <span>3</span>
//     </div>
// )
// let map2element = (
//     <div>
//         <div><span>1</span></div>
//         <div><span>2</span></div>
//         <div><span>3</span></div>
//     </div>
// )
// // turn element => element1

// let spans = [
//     <span>1</span>,
//     <span>2</span>,
//     <span>3</span>
// ]
// //let divs = spans.map(item => <div>{item}</div>)
// let divs = React.Children.map(spans, (item, index) => <div key={index}>{item}</div>)
// function map(children, fn) {
//     return children.map(fn)
// }

// let element1 = <div>{divs}</div>


// 4
// setInterval(() => {
//     let element1 = <div>{new Date().toLocaleString()}</div>
//     /**
//      *  Object.freeze(element.props);
//         Object.freeze(element);
//      */

//     ReactDOM.render(element1, document.getElementById('root')) 
// }, 1000)

let element2 = React.createElement("h1", null, "heloo")
ReactDOM.render(element2, document.getElementById('root')) 
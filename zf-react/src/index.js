import React from './react'
import ReactDOM from './react-dom'

//let element = <h1 id="title"><span>hello</span><span>world</span></h1>
let element = React.createElement('h1', {id: 'title'}, 
    React.createElement('span', { style: { color: 'red', backgroundColor: 'yellow'}}, 'hello'), 
    React.createElement('span', { className: 'world', viData: 'vi-global'}, 'world'))
console.log(element)
ReactDOM.render(element, document.getElementById('root'))
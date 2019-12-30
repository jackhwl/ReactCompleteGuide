import React from './react'
import ReactDOM from 'react-dom'

let element = <h1 id="title"><span>hello</span><span>world</span></h1>
element = React.createElement('h1', {id: 'title'}, 
    React.createElement('span', null, 'hello'), 
    React.createElement('span', null, 'world'))
console.log(element)
//ReactDOM.render(element, document.getElementById('root'))
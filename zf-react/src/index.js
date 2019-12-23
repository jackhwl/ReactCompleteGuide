import React from 'react'
import ReactDOM from 'react-dom'

let style = { border: '1px solid red' }
let element1 = <h1
        style = {style}
        id="hello"
        className="title">hello</h1>
let element2 = React.createElement("h1", null, "heloo")
element2 = {type: 'h1', props: {children: 'hello'}}
ReactDOM.render(element1, document.getElementById('root'))
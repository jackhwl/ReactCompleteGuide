import React from 'react'
import './Person.css'

const Person = (props) => {
    return (
        <div onClick={props.click} className="Person">
            I'm a Person! I'm {props.name}, {props.age} years old.
            <p>{props.children}</p>
            <input type="text" onChange={props.changed} value={props.name} />
        </div>
    )
}

export default Person

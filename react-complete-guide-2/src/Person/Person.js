import React from 'react'

const Person = (props) => {
    return (
        <div onClick={props.click}>
            I'm a Person! I'm {props.name}, {props.age} years old.
            <p>{props.children}</p>
            <input type="text" onChange={props.changed} value={props.name} />
        </div>
    )
}

export default Person

import React from 'react'

const Person = (props) => {
    return (
        <div>
            I'm a Person! I'm {props.name}, {props.age} years old.
            <p>{props.children}</p>
        </div>
    )
}

export default Person

import React from 'react'
import styled from 'styled-components'
import classes from './Person.module.css'

const Person = (props) => {
    return (
        <div className={classes.Person}>
            <p onClick={props.click}>I'm a Person! I'm {props.name}, {props.age} years old.</p>
            <p>{props.children}</p>
            <input type="text" onChange={props.changed} value={props.name} />
        </div>
    )
}

export default Person

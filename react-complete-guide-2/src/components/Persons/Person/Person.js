import React, { Component } from 'react'
import classes from './Person.module.css'
import Aux from '../../../hoc/Auxiliary'
import WithClass from '../../../hoc/WithClass'


class Person extends Component {
    render() {
        console.log('[Person.js] rendering...')
        return (
            <WithClass classes={classes.Person}>
                <p onClick={this.props.click}>I'm a Person! I'm {this.props.name}, {this.props.age} years old.</p>
                <p>{this.props.children}</p>
                <input type="text" onChange={this.props.changed} value={this.props.name} />
            </WithClass>
        )
    }
}
export default Person

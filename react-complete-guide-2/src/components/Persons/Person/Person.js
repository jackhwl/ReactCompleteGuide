import React, { Component } from 'react'
import classes from './Person.module.css'
import Aux from '../../../hoc/Auxiliary'
import withClass2 from '../../../hoc/withClass2'
import PropTypes from 'prop-types'


class Person extends Component {
    render() {
        console.log('[Person.js] rendering...')
        return (
            <Aux>
                <p onClick={this.props.click}>I'm a Person! I'm {this.props.name}, {this.props.age} years old.</p>
                <p>{this.props.children}</p>
                <input type="text" onChange={this.props.changed} value={this.props.name} />
            </Aux>
        )
    }
}

Person.propTypes = {
    click: PropTypes.func,
    name: PropTypes.string,
    age: PropTypes.number,
    changed: PropTypes.func
}
export default withClass2(Person, classes.Person)

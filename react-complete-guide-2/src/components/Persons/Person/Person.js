import React, { Component } from 'react'
import classes from './Person.module.css'
import Aux from '../../../hoc/Auxiliary'
import withClass2 from '../../../hoc/withClass2'
import PropTypes from 'prop-types'
import AuthContext from '../../../context/auth-context'

class Person extends Component {
    constructor(props){
        super(props)
        this.inputElementRef = React.createRef()
    }
    static contextType = AuthContext;
    componentDidMount() {
        //this.inputElement.focus();
        this.inputElementRef.current.focus()
        console.log(this.context.authenticated)
    }

    render() {
        console.log('[Person.js] rendering...')
        return (
            <Aux>
                {this.context.authenticated ? <p>Authenticated!</p> : <p>Please log in</p>}
                <p onClick={this.props.click}>I'm a Person! I'm {this.props.name}, {this.props.age} years old.</p>
                <p>{this.props.children}</p>
                <input type="text" 
                // ref={(inputEl)=>{this.inputElement = inputEl}}
                ref = {this.inputElementRef}
                onChange={this.props.changed} value={this.props.name} />
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

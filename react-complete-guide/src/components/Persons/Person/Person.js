import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Aux from '../../../hoc/Auxiliary';
import classes from './Person.css';
import wrapperWithClass from '../../../hoc/wrapperWithClass';
import AuthContext from '../../../context/auth-context';

class Person extends PureComponent {
    constructor(props) {
        super(props);
        this.inputElementRef = React.createRef();
    }

    static contextType = AuthContext;

    componentDidMount() {
        //document.querySelector('input').focus();
        //this.inputElement.focus();
        this.inputElementRef.current.focus();
        console.log('this.context.authenticated=',this.context.authenticated);
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log('[Person.js] shouldComponentUpdate');
    //     if ( nextProps.persons !== this.props.persons
    //         || nextProps.onClick !== this.props.click
    //         || nextProps.onChange !== this.props.changed) {
    //             return true;
    //         } else {
    //             return false;
    //         }

    // }

    render() {
        console.log('[Person.js] rendering...');
        // const rnd = Math.random();

        // if (rnd > 0.7) {
        //     throw new Error( 'Something went wrong' );
        // }
        return (
            //<div className={classes.Person}>
            //<Fragment>
            <Aux>
                {/* <AuthContext.Consumer>
                    {context => context.authenticated ? <p>Authenticated!</p> : <p>Please log in</p>}
                </AuthContext.Consumer> */}
                 {this.context.authenticated ? <p>Authenticated!</p> : <p>Please log in</p>}
                <p onClick={this.props.click} onChange={this.props.changed}>I'm {this.props.name} and I am {this.props.age} years old!</p>
                <p>{this.props.children}</p>
                <input 
                    //ref={(inputEl) => { this.inputElement = inputEl}}
                    ref={this.inputElementRef}
                type="text" onChange={this.props.changed} value={this.props.name} />
            </Aux>
            //</Fragment>
            //</div>
        )
    }
}

Person.propTypes = {
    click: PropTypes.func,
    name: PropTypes.string,
    age: PropTypes.number,
    chaned: PropTypes.func
};

export default wrapperWithClass(Person, classes.Person);
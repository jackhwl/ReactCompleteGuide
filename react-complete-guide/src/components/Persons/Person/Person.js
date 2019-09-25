import React, { PureComponent, Fragment } from 'react';
import Aux from '../../../hoc/Aux';
import classes from './Person.css';

class Person extends PureComponent {

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
                <p onClick={this.props.click} onChange={this.props.changed}>I'm {this.props.name} and I am {this.props.age} years old!</p>
                <p>{this.props.children}</p>
                <input type="text" onChange={this.props.changed} value={this.props.name} />
            </Aux>
            //</Fragment>
            //</div>
        )
    }
}

export default Person;
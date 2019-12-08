import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreaters from '../../store/actions/actions'

import CounterControl from '../../components/CounterControl/CounterControl';
import CounterOutput from '../../components/CounterOutput/CounterOutput';

class Counter extends Component {
    // state = {
    //     counter: 0
    // }

    // counterChangedHandler = ( action, value ) => {
    //     switch ( action ) {
    //         case 'inc':
    //             this.setState( ( prevState ) => { return { counter: prevState.counter + 1 } } )
    //             break;
    //         case 'dec':
    //             this.setState( ( prevState ) => { return { counter: prevState.counter - 1 } } )
    //             break;
    //         case 'add':
    //             this.setState( ( prevState ) => { return { counter: prevState.counter + value } } )
    //             break;
    //         case 'sub':
    //             this.setState( ( prevState ) => { return { counter: prevState.counter - value } } )
    //             break;
    //     }
    // }

    render () {
        return (
            <div>
                <CounterOutput value={this.props.counter} />
                <CounterControl label="Increment" clicked={this.props.onIncrementCounter} />
                <CounterControl label="Decrement" clicked={this.props.onDecrementCounter}  />
                <CounterControl label="Add n" clicked={this.props.onAddCounter}  />
                <CounterControl label="Subtract m" clicked={this.props.onSubtractCounter}  />
                <hr />
                <button onClick={() => this.props.onStoreResult(this.props.counter)}>Store Result</button>
                <ul>
                    {this.props.results.map(result => (
                        <li key={result.id} onClick={()=>this.props.onDeleteResult(result.id)}>{result.value}</li>
                    ))}
                    
                </ul>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        counter: state.ctr.counter,
        results: state.res.results
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIncrementCounter: () => dispatch(actionCreaters.increment()),
        onDecrementCounter: () => dispatch(actionCreaters.decrement()),
        onAddCounter: () => dispatch(actionCreaters.add(10)),
        onSubtractCounter: () => dispatch(actionCreaters.subtract(15)),
        onStoreResult: (result) => dispatch(actionCreaters.store_result(result)),
        onDeleteResult: (id) => dispatch(actionCreaters.delete_result(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
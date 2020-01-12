import React from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions/counter'
function Counter(props) {
    return (
        <div>
            <div>{props.number}</div>
            <button onClick={props.add}>+</button>
            <button onClick={props.delayAdd}>delay +</button>
        </div>
    )
}

export default connect(
    state => state.counter,
    actions
)(Counter)
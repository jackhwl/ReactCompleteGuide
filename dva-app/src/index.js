import dva, { connect } from 'dva'
import React from 'react'
import { Router, Route} from 'dva/router'

let app = dva()
app.model({
    namespace: 'counter1',
    state: { number: 0},
    reducers: {
        add(state){
            return { number: state.number + 1}
        },
        minus(state){
            return { number: state.number - 1}
        }
    }
})
app.model({
    namespace: 'counter2',
    state: { number: 0},
    reducers: {
        add(state){
            return { number: state.number + 1}
        },
        minus(state){
            return { number: state.number - 1}
        }
    }
})

function Counter1(props){
    return (
        <div>
            <p>{props.number}</p>
            <button onClick={()=>props.dispatch({type: 'counter1/add'})}>+</button>
            <button onClick={()=>props.dispatch({type: 'counter1/minus'})}>-</button>
        </div>
    )
}
const ConnectedCounter1 = connect(state => state.counter1)(Counter1)
function Counter2(props){
    return (
        <div>
            <p>{props.number}</p>
            <button onClick={()=>props.dispatch({type: 'counter2/add'})}>+</button>
            <button onClick={()=>props.dispatch({type: 'counter2/minus'})}>-</button>
        </div>
    )
}
const ConnectedCounter2 = connect(state => state.counter2)(Counter2)
app.router(({history})=> 
    <Router history={history}>
        <>
            <Route path="/counter1" component={ConnectedCounter1} />
            <Route path="/counter2" component={ConnectedCounter2} />
        </>
    </Router>)
app.start('#root')

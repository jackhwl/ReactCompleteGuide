import React from 'react'
import ReactDOM from 'react-dom'
import dva, { connect } from './dva'
import { Router, Route} from 'dva/router'
import {createBrowserHistory} from 'history'

let app = dva({
    history: createBrowserHistory
})

app.model({
    namespace: 'counter',
    state: { number: 0},
    reducers: {
        add(state){
            return { number: state.number + 1}
        },
        minus(state){
            return { number: state.number - 1}
        }
    },
    effects: {
        *asyncAdd(action, {put}){
            yield delay(1000)
            yield put({ type: 'add'})
        },
        *asyncMinus(action, {put}){
            yield delay(1000)
            yield put({ type: 'minus'})
        }
    }
})

function Counter(props){
    return (
        <div>
            <p>{props.number}</p>
            <button onClick={()=>props.dispatch({type: 'counter/add'})}>+</button> 
            <button onClick={()=>props.dispatch({type: 'counter/asyncAdd'})}>async+</button> 
            <button onClick={()=>props.dispatch({type: 'counter/asyncMinus'})}>async-</button> 
        </div>
    )
}
const ConnectedCounter = connect(state => state.counter)(Counter)
app.router(()=> <ConnectedCounter />)
// app.router(({history})=> 
//     <Router history={history}>
//         <>
//             <Route path="/counter" component={ConnectedCounter} />
//         </>
//     </Router>)
app.start('#root')

function delay(ms){
    return new Promise(function(resolve){
        setTimeout(()=>{
            resolve()
        },ms)
    })
}

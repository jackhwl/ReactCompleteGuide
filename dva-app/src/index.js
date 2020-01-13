import dva, { connect } from 'dva'
import React from 'react'
import { Router, Route} from 'dva/router'

let app = dva()
const delay = ms => new Promise(function(resolve){
    setTimeout(()=>{
        resolve()
    }, ms)
})
app.model({
    namespace: 'counter1',
    state: { number: 0},
    reducers: {
        add(state){
            return { number: state.number + 1}
        },
        minus(state){
            return { number: state.number - 1}
        },
        log(state){
            console.log('reducers log')
            return { number: 100}
        }
    },
    effects: {
        *asyncAdd(action, {put, call}) {
            yield call(delay, 1000)
            yield put({type: 'add'})
        },
        *log(action, {select}){
            let state = yield select(state=>state.counter1 )
            console.log('effects log', state)
        }
    },
    subscriptions: {
        changeTitle({history}){
             history.listen((location)=> {
                 console.log(location)
                 document.title = location.pathname
             })
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
            <button onClick={()=>props.dispatch({type: 'counter1/asyncAdd'})}>async+</button>
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

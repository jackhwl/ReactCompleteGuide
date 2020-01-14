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
        }
    }
})

function Counter(props){
    return (
        <div>
            <p>{props.number}</p>
            <button onClick={()=>props.dispatch({type: 'counter/add'})}>+</button> 
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

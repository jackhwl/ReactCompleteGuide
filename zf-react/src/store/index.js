import { createStore, applyMiddleware } from '../redux'
import counter from './reducers/counter'

function logger({dispatch, getState}) {
    return function (next){
        return function (action) { // store.dispatch this is rewrite dispatch method
            console.log('old state:', getState())
            next(action)
            console.log('new state:', getState())
        }
    }
}
function thunk({dispatch, getState}) {
    return function (next){
        return function (action) { // store.dispatch this is rewrite dispatch method
            if (typeof action === 'function') {
                action(dispatch, getState)
            } else {
                next(action)
            }
        }
    }
}
function promise({dispatch, getState}) {
    return function (next){
        return function (action) { // store.dispatch this is rewrite dispatch method
            if (typeof action.then  === 'function') {
                action.then(dispatch)
                //action.then(result => dispatch(dispatch))
            } else {
                next(action)
            }
        }
    }
}

let store = applyMiddleware(promise, thunk, logger)(createStore)(counter)
export default store
/**
 * essential of middleware is rewrite dispatch
 */
//const store = createStore(counter);
//console.log(store)
//let dispatch = store.dispatch
// store.dispatch = function(action) {
//     console.log('old state:', store.getState())
//     dispatch(action)
//     console.log('new state:', store.getState())
// }
// delay 1 second, then dispatch
// store.dispatch = function(action) {
//     setTimeout(function(){
//         dispatch(action)
//     }, 1000)
// }
//export default store
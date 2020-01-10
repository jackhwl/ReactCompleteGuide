import * as ActionType from '../actionType'
//import store from '../store'

export function add() {
    //return store.dispatch({type: ActionType.ADD}) 
    return {type: ActionType.ADD}
}
export function minus() {
    //return store.dispatch({type: ActionType.MINUS}) 
    return {type: ActionType.MINUS}
}
export function thunkAdd() {
    return function(dispatch, getState){
        setTimeout(function() {
            dispatch({type: ActionType.ADD})
        }, 1000)
    }
}
export function promiseAdd() {
    return new Promise(function (resolve){
        setTimeout(function() {
            resolve({type: ActionType.ADD})
        }, 1000)
    })
}
export default {
    add,
    minus,
    thunkAdd,
    promiseAdd
}
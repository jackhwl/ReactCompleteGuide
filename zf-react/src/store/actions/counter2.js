import * as ActionType from '../actionType'
//import store from '../store'

export function add() {
    //return store.dispatch({type: ActionType.ADD}) 
    return {type: ActionType.ADD2}
}
export function minus() {
    //return store.dispatch({type: ActionType.MINUS}) 
    return {type: ActionType.MINUS2}
}

export default {
    add,
    minus
}
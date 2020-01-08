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

export default {
    add,
    minus
}
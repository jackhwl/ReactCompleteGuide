import * as ActionTypes from '../actionType'

let initialState = { number: 0 }
export default function (state = initialState, action){
    switch (action.type) {
        case ActionTypes.ADD2:
            return { number: state.number + 1}
        case ActionTypes.MINUS2:
            return { number: state.number - 1}
        default:
            return state
    }
}
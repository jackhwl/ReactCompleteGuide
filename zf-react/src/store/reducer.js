import * as ActionTypes from './actionType'

let initialState = { number: 0 }
export default function (state = initialState, action){
    switch (action.type) {
        case ActionTypes.ADD:
            return { number: state.number + 1}
        case ActionTypes.MINUS:
            return { number: state.number - 1}
        default:
            return state
    }
}
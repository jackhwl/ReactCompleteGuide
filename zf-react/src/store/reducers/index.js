import {combineReducers} from '../../redux'
import counter1 from './counter1'
import counter2 from './counter2'

let reducers = {
    counter1,
    counter2
}

let combinedReducer = combineReducers(reducers)

export default combinedReducer
// export default function(state,action) {
//     let newState = {
//         counter1: {number: 0},
//         counter2: {number: 0}
//     }
//     newState.counter1 = reducer1({number: 0}, action)
//     newState.counter2 = reducer2({number: 0}, action)

//     return newState
// }
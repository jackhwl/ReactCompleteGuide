import { combineReducers } from 'redux'
import counter from './counter'

let combinedReducer = combineReducers({
    counter
})
export default combinedReducer
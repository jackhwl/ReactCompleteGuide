import { combineReducers } from 'redux'
import counter from './counter'
import history from '../../history'
import {connectRouter} from '../../connected-react-router'
let combinedReducer = combineReducers({
    counter,
    router: connectRouter(history)
})
export default combinedReducer
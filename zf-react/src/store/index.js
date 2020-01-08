import { createStore } from '../redux'
import reducer from './reducers/counter'

const store = createStore(reducer);
console.log(store)
let dispatch = store.dispatch
store.dispatch = function(action) {
    console.log('old state:', store.getState())
    dispatch(action)
    console.log('new state:', store.getState())
}
export default store
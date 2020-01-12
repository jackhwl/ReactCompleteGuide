import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers/index'
import { routerMiddleware } from '../connected-react-router'
import history from '../history'
// let middleware = routerMiddleware(history)
// let store = createStore(reducers)
let store = applyMiddleware(routerMiddleware(history))(createStore)(reducers)
export default store
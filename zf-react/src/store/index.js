import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers/index'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'
let sagaMiddleware = createSagaMiddleware()
let store = applyMiddleware(sagaMiddleware)(createStore)(reducers)

sagaMiddleware.run(rootSaga)
// run(rootSaga)
// function run(rootSaga){
//     let it = rootSaga()
//     it.next()
// }
export default store
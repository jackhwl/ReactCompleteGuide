import { compose } from '../redux'
export default function applyMiddleware(...middlewares) {
    return function(createStore) {
        return function(reducer) {
            let store = createStore(reducer)
            let dispatch
            let middlewareAPI = {
                getState: store.getState,
                dispatch: action => dispatch(action)
            }
            const chain = middlewares.map(middleware => middleware(middlewareAPI))
            // middleware = middleware({
            //     getState: store.getState,
            //     dispatch: action => dispatch(action)
            // })
            dispatch = compose(...chain)(store.dispatch)
            return {
                ...store, 
                dispatch
            }
        }
    }
}

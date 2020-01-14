import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, combineReducers} from 'redux'
import {Provider, connect} from 'react-redux'
import { createHashHistory } from 'history'
export { connect }
export default function(opts={}){
    let history = opts.history || createHashHistory()

    let app = { 
        _models: [],
        model,
        _router: null,
        router,
        start
    }
    function model(m){
        app._models.push(m)
    }
    function router(router){
        app._router = router
    }
    function start(container){
        let reducers = getReducers(app)
        app._store = createStore(reducers)
        ReactDOM.render(
            <Provider store={app._store}>
                {app._router()}
            </Provider>
            , document.querySelector(container) )
    }
    return app
}

function getReducers(app){
    let reducers = {}
    for (const model of app._models){
        reducers[model.namespace] = function(state=model.state, action){
            let model_reducers = model.reducers
            let reducer = model_reducers[action.type]
            if (reducer) {
                return reducer(state, action)
            }
            return state
        }
    }

    return combineReducers(reducers)
}

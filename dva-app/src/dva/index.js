import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider, connect} from 'react-redux'
import { createHashHistory } from 'history'
import {  NAMESPACE_SEP } from './constant'
import createSagaMiddleware from 'redux-saga'
import * as sagaEffects from 'redux-saga/effects'
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
        const prefixedModel = prefixNamespace(m)
        app._models.push(prefixedModel)
    }
    function router(router){
        app._router = router
    }
    function start(container){
        let reducers = getReducers(app)
        let sagas = getSagas(app)
        //app._store = createStore(reducers)
        let sagaMiddleware = createSagaMiddleware()
        app._store = applyMiddleware(sagaMiddleware)(createStore)(reducers)
        sagas.forEach(sagaMiddleware.run)
        ReactDOM.render(
            <Provider store={app._store}>
                {app._router()}
            </Provider>
            , document.querySelector(container) )
    }
    return app
}

// turn reducer in model to a reducer in state
// function reducer(state={number: 0}, action){
//     if (action.type==='counter/add'){
//         return add(state, action)
//     } else if (action.type==='counter/minus'){
//         return minus(state, action)
//     } else {
//         return state
//     }
// }
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

function prefix(obj, namespace){
    return Object.keys(obj).reduce((memo, key)=>{
        let newKey = `${namespace}${NAMESPACE_SEP}${key}`
        memo[newKey] = obj[key]
        return memo
    },{})
}
function prefixNamespace(model){
    if (model.reducers){
        model.reducers = prefix(model.reducers, model.namespace)
    }
    if (model.effects){
        model.effects = prefix(model.effects, model.namespace)
    }
    return model
}

function getSagas(app){
    let sagas = []
    for (const model of app._models){
        sagas.push(function*(){
            for(const key in model.effects){
                const watcher =  getWatcher(key, model.effects[key], model)
                yield sagaEffects.fork(watcher)
            }
        })
    }
    return sagas
}
function prefixType(type, model){
    if(type.indexOf('/')==-1){
        return `${model.namespace}${NAMESPACE_SEP}${type}`
    } else {
        if (type.startsWith(model.namespace)){
            console.error(`Warning: [sageEffects.put] ${type} should not be prefixed with namespace ${model.namespace}`)
        }
    }
    return type    
}
function getWatcher(key, effect, model){
    function put(action){
        return sagaEffects.put({...action, type: prefixType(action.type, model)})
    }
    return function*(){
        yield sagaEffects.takeEvery(key, function*(...args){
            yield effect(...args, {...sagaEffects, put})
        })
    }
}

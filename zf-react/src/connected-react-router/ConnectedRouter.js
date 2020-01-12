import {Router} from 'react-router'
import React, { useEffect, useContext} from 'react'
import { LOCATION_CHANGE } from './types'
import { ReactReduxContext} from 'react-redux'

export default function (props) {
    let {store} = useContext(ReactReduxContext)
    useEffect(() => {
        return props.history.listen((location, action) => {
            store.dispatch({
                type: LOCATION_CHANGE,
                payload: {
                    location, action
                }
            })
        })
    }, [])
    return (
        <Router history={props.history}>
            {props.children}
        </Router>
    )
}
import React from 'react'
import {Route, Redirect} from '../react-router-dom'

export default function(props) {
    let {path, component: RouteComponent} = props
    return (
        <Route path={path} render={routeProps => {
            return localStorage.getItem('login') ? <RouteComponent {...routeProps} /> :
                <Redirect to={{pathname: '/login', state: {from: routeProps.location.pathname } }} />
        }} />
    )
}
import React from 'react'
import {Route} from '../react-router-dom'
export default function(OldComponent) {
    return props => (
        <Route render={
            routeProps => <OldComponent {...props} {...routeProps} />
        } />
    )
}
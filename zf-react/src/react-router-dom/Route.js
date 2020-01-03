import React from 'react'
import RouterContext from './RouterContext'

/**
 * Route represent one route rule
 * path: rule's path
 * component: the component need render 
 */
export default class Route extends React.Component {
    static contextType = RouterContext
    render() {
        let {path, component: RouteComponent, exact} = this.props
        let pathname = this.context.location.pathname
        if ((exact && pathname === path) || (!exact && pathname.startsWith(path))) {
            return <RouteComponent />
        }
        return null
    }
}
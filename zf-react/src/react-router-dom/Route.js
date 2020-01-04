import React from 'react'
import RouterContext from './RouterContext'
import pathToRegexp from 'path-to-regexp'
console.log(pathToRegexp)
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
        let paramNames = []
        let regexp = pathToRegexp(path, paramNames, { end: exact })
        //if ((exact && pathname === path) || (!exact && pathname.startsWith(path))) {
        if (regexp.test(pathname)) {
            return <RouteComponent history={this.context.history} />
        }
        return null
    }
}
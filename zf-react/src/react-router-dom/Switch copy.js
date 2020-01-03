import React, {useContext} from 'react'
import RouterContext from './RouterContext'
import pathToRegexp from 'path-to-regexp'

/**
 * useContext is the third way to get context
 * 1. static contextType (class), 2. Consumer(function), 3 useContext
 * @param {*} props 
 */
export default function (props) {
    let routerContext = useContext(RouterContext)
    let children = props.children
    children = Array.isArray(children) ? children : [children]
    let pathname = routerContext.location.pathname
    for (let i = 0; i < children.length; i++){
        let child = children[i]
        let {path = "/", component, exact} = child.props
        let regexp = pathToRegexp(path, [], { end: exact})
        let matched = pathname.match(regexp)
        if (matched) {
            return child
        }
    }
    return null
}
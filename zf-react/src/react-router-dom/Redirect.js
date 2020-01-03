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
    if (!props.from || props.from === routerContext.location.pathname) {
        routerContext.history.push(props.to)
    }
    return null
}
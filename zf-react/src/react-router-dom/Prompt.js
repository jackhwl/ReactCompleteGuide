import React, { useContext } from 'react'
import RouterContext from './RouterContext'

export default function(props){
    let routerContext = useContext(RouterContext)
    let { when, message } = props
    if(when){
        routerContext.history.block(message)
    } else {
        routerContext.history.unblock()
    }
    return null
}
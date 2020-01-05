import React, { useState, useEffect } from 'react'
import RouterContext from './RouterContext'

export default function BrowserRouter(props){
    let [currentState, setCurrentState] = useState({location: {pathname: '/'}})
    useEffect(() => {
        window.onpushstate = (state, pathname) => {
            setCurrentState({
                location: {
                    ...currentState.location,
                    pathname,
                    state
                }
            })
        }
        window.onpopstate = (event) => {
            setCurrentState({
                location: {
                    ...currentState.location,
                    pathname: window.location.pathname,
                    state: event.state
                }
            })
        }
    }, [])

    const globalHistory = window.history
    let history = {
        location: currentState.location,
        push(to) {
            if(history.prompt){
                let target = typeof to === 'string' ? { pathname: to } : to
                let yes = window.confirm(history.prompt(target))
                if(!yes) return
            }
            if(typeof to === 'object') {
                let {pathname, state} = to
                globalHistory.pushState(state, null, pathname)
            } else {
                globalHistory.pushState(null, null, to)
            }
        },
        block(prompt){
            history.prompt = prompt
        },
        unblock(){
            history.prompt = null
        }
    }
    let routerValue = {
        location: currentState.location,
        history
    }
    return (
        <RouterContext.Provider value={routerValue}>
            {props.children}
        </RouterContext.Provider>
    )
}

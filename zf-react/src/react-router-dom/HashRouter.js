import React, { useState } from 'react'
import RouterContext from './RouterContext'

/**
 * HashRouter is a container, doesn't have DOM structure, it render sub component
 */
export default class HashRouter extends React.Component {
    state = {
        location: {
            pathname: window.location.hash.slice(1),
            state: window.history.state
        }
    }
    componentDidMount(){
        window.addEventListener('hashchange', event => {
            this.setState({
                ...this.state,
                location: {
                    ...this.state.location,
                    pathname: window.location.hash.slice(1) || '/',
                    state: this.locationState
                }
            })
        })
        window.location.hash = window.location.hash || '/'
    }
    render() {
        let that = this
        let history = {
            location: this.state.location,
            push(to) {
                if(typeof to === 'object') {
                    let {pathname, state} = to
                    that.locationState = state
                    window.location.hash = pathname
                } else {
                    window.location.hash = to
                }
            }
        }
        let routerValue = {
            location: that.state.location,
            history
        }
        return (
            <RouterContext.Provider value={routerValue}>
                {that.props.children}
            </RouterContext.Provider>
        )
    }
}
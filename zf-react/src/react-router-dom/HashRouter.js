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
                    pathname: window.location.hash.slice(1) || '/'
                }
            })
        })
        window.location.hash = window.location.hash || '/'
    }
    render() {
        let routerValue = {
            location: this.state.location
        }
        return (
            <RouterContext.Provider value={routerValue}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}
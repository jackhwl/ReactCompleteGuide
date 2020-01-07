import React from 'react'
import ReactReduxContext from './Context'

export default function(props) { // {store:}
    return (
        <ReactReduxContext.Provider value={{store: props.store}}>
            {props.children}
        </ReactReduxContext.Provider>
    )
}
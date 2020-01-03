import React from 'react'
import RouterContext from './RouterContext'

export default function (OldComponent) {
    return (
        <RouterContext.Consumer>
            {
                contextValue => {
                    let children = props.children
                }
            }
        </RouterContext.Consumer>        
    )
}
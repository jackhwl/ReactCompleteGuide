import React from 'react'

export default function Link(props) {
    return (
        <a href={`#${props.to}`}>{props.children}</a>
    )
}
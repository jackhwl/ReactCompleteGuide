import React from 'react'

export default function(props) {
    return (
        <div>
            <div>Counter</div>
            <button onClick={()=>props.history.go(-1)}>go back </button>
        </div>
    )
}
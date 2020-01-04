import React, { useRef } from 'react'

export default function(props) {
    let usernameRef = useRef()
    function submitHandler(event){
        event.preventDefault()
        localStorage.setItem('login', usernameRef.current.value)
        if (props.location.state) {
            return props.history.push(props.location.state.from)
        } else {
            return props.history.push('/')
        }
    }   
    return (
        <form onSubmit={submitHandler}>
            User Name<input type="text" className="form-control" ref={usernameRef} />
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
    )
}
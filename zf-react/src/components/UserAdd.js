import React, {useRef, useState, useEffect} from 'react'
import { Prompt } from '../react-router-dom'
export default function(props) {
    let [isBlocking, setIsBlocking] = useState(false)
    let [submitting, setSubmitting] = useState(false)
    let usernameRef = useRef()
    function submitHandler(event){
        event.preventDefault()
        setIsBlocking(false)
        setSubmitting(true)
    }
    //useEffect equvilent componentDidMount+componentDidUpdate
    useEffect(function(){
        if (submitting){
            let username = usernameRef.current.value
            let usersStr = localStorage.getItem('users')
            let users = usersStr ? JSON.parse(usersStr):[]
            users.push({id: Date.now() + "", username})
            localStorage.setItem('users', JSON.stringify(users))
            props.history.push('/user/list')
        }
    },[submitting])

    return (
        <>
            <Prompt when={isBlocking} 
                message={location => `are you sure redirect to ${location.pathname}? `}/>
            <form onSubmit={submitHandler}>
                User Name
                <input type="text" className="form-control" ref={usernameRef} onChange={
                    event => setIsBlocking(event.target.value.length > 0)
                } />
                <button type="submit" className="btn btn-primary">submit</button>
            </form>
        </>
    )
}
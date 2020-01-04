import React, {useRef} from 'react'

export default function(props) {
    let usernameRef = useRef()
    function submitHandler(event){
        event.preventDefault()
        let username = usernameRef.current.value
        let usersStr = localStorage.getItem('users')
        let users = usersStr ? JSON.parse(usersStr):[]
        users.push({id: Date.now() + "", username})
        localStorage.setItem('users', JSON.stringify(users))
        props.history.push('/user/list')
    }
    return (
        <form onSubmit={submitHandler}>
            User Name<input type="text" className="form-control" ref={usernameRef} />
            <button type="submit" className="btn btn-primary">submit</button>
        </form>
    )
}
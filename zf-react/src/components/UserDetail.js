import React, { useState, useEffect } from 'react'
export default function(props) {
    let user = props.location.state
    if (!user){
        let usersStr = localStorage.getItem('users')
        let users = usersStr ? JSON.parse(usersStr):[]
        user = users.find(user=>user.id===props.match.params.id)
    }
    return (
        <div>
            <p>ID: {user.id}</p>
            <p>UserName: {user.username}</p>
        </div>
    )
}
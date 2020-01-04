import React, { useState, useEffect } from 'react'

export default function(props) {
    let [users, setUsers] = useState([])
    useEffect(() => {
        let usersStr = localStorage.getItem('users')
        let users = usersStr ? JSON.parse(usersStr):[]
        setUsers(users)
    }, [])
    return (
        <ul className="list-group">
            {
                users.map(user => 
                    (
                    <li className="list-group-item" key={user.id}>
                        {user.username}
                    </li>
                    )
                )
            }
        </ul>
    )
}

// class UserList extends React.Component {
//     state = { users: []}
//     componentDidMount() {
//         let usersStr = localStorage.getItem('users')
//         let users = usersStr ? JSON.parse(usersStr):[]
//         this.setState({users})
//     }
//     render(){
//         return (
//             <ul className="list-group">
//                 {
//                     this.state.users.map(user => 
//                         (
//                         <li className="list-group-item" key={user.id}>
//                             {user.username}
//                         </li>
//                         )
//                     )
//                 }
//             </ul>
//         )
//     }
// }
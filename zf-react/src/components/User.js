import React from 'react'
import {Link, Route} from '../react-router-dom'
import UserAdd from './UserAdd'
import UserList from './UserList'
import UserDetail from './UserDetail'

export default function(props) {
    console.log(props)
    return (
        <div className="row">
            <div className="col-md-2">
                <ul className="nav nav-stack">
                    <li><Link to="/user/list">user list</Link></li>
                    <li><Link to="/user/add">add user</Link></li>
                </ul>
            </div>
            <div className="col-md-10">
                <Route path="/user/list" component={UserList} />
                <Route path="/user/add" component={UserAdd} />
                <Route path="/user/detail/:id" component={UserDetail} />
            </div>
        </div>
    )
}
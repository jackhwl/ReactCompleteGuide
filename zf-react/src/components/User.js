import React from 'react'
import {NavLink, Route, Switch, Redirect} from '../react-router-dom'
import UserAdd from './UserAdd'
import UserList from './UserList'
import UserDetail from './UserDetail'

export default function(props) {
    console.log(props)
    return (
        <div className="row">
            <div className="col-md-2">
                <ul className="nav nav-stack">
                    <li><NavLink to="/user/list">user list</NavLink></li>
                    <li><NavLink to="/user/add">add user</NavLink></li>
                </ul>
            </div>
            <div className="col-md-10">
                <Switch>
                    <Route path="/user/list" component={UserList} />
                    <Route path="/user/add" component={UserAdd} />
                    <Route path="/user/detail/:id" component={UserDetail} />
                    <Redirect to="/user/list" />
                </Switch>
            </div>
        </div>
    )
}
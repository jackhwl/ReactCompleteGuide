import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Switch, Redirect, NavLink } from '../src/react-router-dom'
import Home from '../src/components/Home'
import User from '../src/components/User'
import Profile from '../src/components/Profile'
import Login from '../src/components/Login'
import Private from '../src/components/Private'
import NavHeader from '../src/components/NavHeader'
import 'bootstrap/dist/css/bootstrap.css'
/**
 * Router is container
 * Route is rule
 */
ReactDOM.render(
<Router>
    <>
        <div className="navbar nvabar-inverse">
            <div className="container-fluid">
                <NavHeader title="Wenlin" />
                <ul className="nav navbar-nav">
                    <li><NavLink exact={true} to="/">Home</NavLink></li>
                    <li><NavLink to="/user">User</NavLink></li>
                    <li><NavLink to="/profile">Profile</NavLink></li>
                    <li><NavLink to="/login">Login</NavLink></li>
                </ul>
                <div>{localStorage.getItem('login')}</div>
            </div>
        </div>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/user" component={User} />
                        <Route path="/user" component={User} />
                        <Private path="/profile" component={Profile} />
                        <Route path="/login" component={Login} />
                        <Redirect from="/home" to="/" />
                    </Switch>
                </div>
            </div>
        </div>
    </>
</Router>, document.getElementById('root'))
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Link } from './react-router-dom'
import Home from './components/Home'
import User from './components/User'
import Profile from './components/Profile'
/**
 * Router is container
 * Route is rule
 */
ReactDOM.render(
<Router>
    <Link to="/">Home</Link>
    <Link to="/user">User</Link>
    <Link to="/profile">Profile</Link>
    <Route path="/" exact component={Home} />
    <Route path="/user" component={User} />
    <Route path="/profile" component={Profile} />
</Router>, document.getElementById('root'))
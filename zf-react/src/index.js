import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Link, Switch, Redirect } from './react-router-dom'
import Home from './components/Home'
import User from './components/User'
import Profile from './components/Profile'
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
                <div className="navbar-heading">
                    <div className="navbar-brand">Jack</div>
                </div>
                <ul className="nav navbar-nav">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/user">User</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
            </div>
        </div>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/user" component={User} />
                        <Route path="/user" component={User} />
                        <Route path="/profile" component={Profile} />
                        <Redirect to="/" />
                    </Switch>
                </div>
            </div>
        </div>
    </>
</Router>, document.getElementById('root'))
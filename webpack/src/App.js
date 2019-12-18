import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import Users from './containers/Users'
import Pizza from './containers/Pizza'
import asyncComponent from './hoc/asyncComponent'

const AstncPizza = asyncComponent(() => {
    return import('./containers/Pizza.js')
})

export class App extends Component {
    render() {
        return (
            <div>
                <div>
                    <Link to="/">Users</Link>
                    <Link to="/pizza">Pizza</Link>
                </div>
                <div>
                    <Route path="/" exact component={Users} />
                    <Route path="/pizza" exact component={AstncPizza} />
                </div>
            </div>
        )
    }
}

export default App

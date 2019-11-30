import React, { Component } from 'react';
//import axios from 'axios'
import { Route, NavLink, Switch, Redirect } from 'react-router-dom'
import './Blog.css';
import Posts from './Posts/Posts'
import asyncComponent from '../../hoc/asyncComponent'
// import NewPost from './NewPost/NewPost'

const AsyncNewPost = asyncComponent(() => {
    return import('./NewPost/NewPost')
})

class Blog extends Component {
    state = {
        auth: true
    }

    render () {

        return (
            <div className="Blog">
                <header>
                    <nav>
                        <ul>
                            <li><NavLink to="/posts/" exact>Post</NavLink></li>
                            <li><NavLink to={{
                                pathname: '/new-post',
                                hash: '#submit',
                                search: '?quick-submit=true'
                            }}>New Post</NavLink></li>
                        </ul>
                    </nav>
                    <button className="hamburger">
                    <span className="hamburger__text">
                        <span className="visually-hidden">Open menu</span>
                    </span>
                    </button>
                    <button className="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                    </button>
                </header>
                {/* <Route path="/" exact render={()=> <h1>Home</h1> } />
                <Route path="/" render={()=> <h1>Home 2</h1> } /> */}
                <Switch>
                    { this.state.auth ? <Route path="/new-post" component={AsyncNewPost} /> : null }
                    <Route path="/posts" component={Posts} />
                    <Route render = {() => <h1>404 Not found</h1>} />
                    {/* <Redirect from="/" to="/posts" /> */}
                    {/* <Route path="/:id" exact component={FullPost} /> */}
                </Switch>
            </div>
        );
    }
}

export default Blog;
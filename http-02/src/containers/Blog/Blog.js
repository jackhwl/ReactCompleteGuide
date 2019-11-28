import React, { Component } from 'react';
//import axios from 'axios'
import { Route, NavLink } from 'react-router-dom'
import Posts from './Posts/Posts'
import NewPost from './NewPost/NewPost'
import FullPost from '../Blog/FullPost/FullPost'

import './Blog.css';

class Blog extends Component {
    render () {

        return (
            <div className="Blog">
                <header>
                    <nav>
                        <ul>
                            <li><NavLink to="/" exact>Home</NavLink></li>
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
                <Route path="/" exact component={Posts} />
                <Route path="/new-post" component={NewPost} />
                <Route path="/:id" exact component={FullPost} />
            </div>
        );
    }
}

export default Blog;
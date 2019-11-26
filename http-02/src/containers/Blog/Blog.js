import React, { Component } from 'react';
//import axios from 'axios'
import axios from '../../axios'

import Post from '../../components/Post/Post';
import FullPost from '../../components/FullPost/FullPost';
import NewPost from '../../components/NewPost/NewPost';
import './Blog.css';

class Blog extends Component {
    state = {
        posts: [],
        selectedPostId: null,
        error: false
    }
    componentDidMount(){
        console.log('blog')
        axios.get('/posts')
            .then((response => {
                const posts = response.data.slice(0,4)
                const updatedPosts = posts.map(post => {
                    return {
                        ...post,
                        author: 'Jack'
                    }
                })
                this.setState({posts: updatedPosts})
                // console.log(response)
            }))
            .catch(error => this.setState({error: true}))
    }

    postSelectedHandler = (id) => {
        console.log('blog id changed', id)
        this.setState({selectedPostId: id})
    }

    render () {
        const posts = this.state.posts.map(post=> 
            <Post 
                key={post.id} 
                title={post.title} 
                author={post.author} 
                clicked={() => this.postSelectedHandler(post.id)}
            />
        )
        return (
            <div>
                <section className="Posts">
                    {posts}
                </section>
                <section>
                    <FullPost id={this.state.selectedPostId} post={this.state.posts} />
                </section>
                <section>
                    <NewPost />
                </section>
            </div>
        );
    }
}

export default Blog;
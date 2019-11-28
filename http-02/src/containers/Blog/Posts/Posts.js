import React, {Component} from 'react'
import axios from '../../../axios'
import Post from '../../../components/Post/Post'
import './Posts.css'

class Posts extends Component {
    state = {
        posts: [],
        selectedPostId: null,
        error: false
    }

    componentDidMount(){
        console.log(this.props)
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
        let posts = <p style={{textAlign: 'center'}}>Something went wrong</p>
        if (!this.state.error){
            posts = this.state.posts.map(post=> 
                <Post 
                    key={post.id} 
                    title={post.title} 
                    author={post.author} 
                    clicked={() => this.postSelectedHandler(post.id)}
                />
            )    
        }

        return (
            <section className="Posts">
                {posts}
            </section>
        )   
    }

}

export default Posts


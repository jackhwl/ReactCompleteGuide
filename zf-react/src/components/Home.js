import React from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions/home'

function Home(props) {
    return (
        <div>
            <div>Home</div>
            <button onClick={()=>props.go('/counter')}>go to counter </button>
        </div>
    )
}

export default connect(
    state=>state,actions
)(Home)
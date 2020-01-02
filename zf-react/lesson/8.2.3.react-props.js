import React from 'react'
import ReactDOM from 'react-dom'

class MouseTracker extends React.Component {
    state = {
        x: 0, y: 0
    }
    mouseMoveHandler = (event) => {
        this.setState({
            x: event.clientX,
            y: event.clientY
        })
    }
    render() {
        return (
            <div onMouseMove={this.mouseMoveHandler}>
                {this.props.render(this.state)}
            </div>
        )
    }

}

ReactDOM.render(
    <div>
        <MouseTracker render={
                props => (
                    <>
                        <h1>please move your mouse</h1>
                        <p>current mouse position: x={props.x} y={props.y}</p>
                    </>
                )
            } />
    </div>, document.getElementById('root'))
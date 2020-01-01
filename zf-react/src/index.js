import React from 'react'
import ReactDOM from 'react-dom'

const COLORS = ['red', 'yellow', 'blue', 'green']
class ScrollList extends React.Component {
    constructor(){
        super()
        this.container = React.createRef()
        this.state = { messages: [] }
    }

    addMessage = () => {
         this.setState({
             messages: [`${this.state.messages.length}`, ...this.state.messages]
         })
    }
    componentDidMount(){
        this.$timerID = window.setInterval(() => {
            this.addMessage()
        }, 1000)
    }
    getSnapshotBeforeUpdate() {
        return this.container.current.scrollHeight
    }
    componentDidUpdate(prevProps, prevState, prevScrollHeight) {
        let scrollHeight = this.container.current.scrollHeight
        let newScrollTop = this.container.current.scrollTop + (scrollHeight - prevScrollHeight)
        this.container.current.scrollTop = newScrollTop
    }
    componentWillUnmount(){
        clearInterval(this.$timerID)
    }
    render() {
        let style = {
            height: 100,
            widht: 200,
            border: '1px solid red',
            overflow: 'auto'
        }
        return (
            <div style={style} ref={this.container}>
                {
                    this.state.messages.map((message, index) => (
                        <div key={index} style={{backgroundColor: COLORS[index % 4]}}>{message}</div>
                    ))
                }
            </div>
        )
    }
}
ReactDOM.render(<ScrollList />, document.getElementById('root'))

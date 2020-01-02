import React from 'react'
import ReactDOM from 'react-dom'

function withLogger(OldComponent) {
    return class extends React.Component {
        componentWillMount() {
            this.start = Date.now()
        }
        componentDidMount() {
            console.log((Date.now() - this.start) + 'ms')
        }
        render() {
            return <OldComponent />
        }
    }
}
class App extends React.Component {

    render() {
        return (
            <div>
                App
            </div>
        )
    }
}
let LoggerApp = withLogger(App)
ReactDOM.render(<LoggerApp />, document.getElementById('root'))
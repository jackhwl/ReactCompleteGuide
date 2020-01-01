import React from 'react'
import ReactDOM from 'react-dom'

let ThemeContext = React.createContext()
class Panel extends React.Component {
    state = { color: 'green'}
    changeColor = (color) => {
        this.setState({color})
    }
    render() {
        let value = { color: this.state.color, changeColor: this.changeColor }

        return (
            <ThemeContext.Provider value={value}>
                <div style={{border: `3px solid ${this.state.color}`, width: 100}}>
                    Panel
                    <Header />
                    <Main />
                </div>
            </ThemeContext.Provider>
        )
    }
}
class Header extends React.Component {
    static contextType = ThemeContext
    render() {
        return <div style={{border: `3px solid ${this.context.color}`}}>Header<Title /></div>
    }
}
class Title extends React.Component {
    static contextType = ThemeContext
    render() {
        return <div style={{border: `3px solid ${this.context.color}`}}>Title</div>
    }
}
class Main extends React.Component {
    static contextType = ThemeContext
    render() {
        return <div style={{border: `3px solid ${this.context.color}`}}>Main<Content /></div>
    }
}
class Content extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{border: `3px solid ${this.context.color}`}}>
                Content
                <button onClick={() => this.context.changeColor('red')}>red</button>
                <button onClick={() => this.context.changeColor('green')}>green</button>
            </div>
        )
    }
}
ReactDOM.render(<Panel />, document.getElementById('root'))
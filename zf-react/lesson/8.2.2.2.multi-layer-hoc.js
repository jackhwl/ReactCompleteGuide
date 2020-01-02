import React from 'react'
import ReactDOM from 'react-dom'
function loadFromLocalStore(OldComponent, name) {
    return class extends React.Component {
        state = { value: null}
        componentDidMount() {
            let value = localStorage.getItem(name)
            console.log('local value=', value)
            this.setState({value})
        } 
        render() {
            console.log('local render state value', this.state.value)
            return (
                <OldComponent value={this.state.value} />
            )
        }
    }

}
function loadFromAjax(OldComponent) {
    return class extends React.Component {
        state = { value: null}
        componentDidMount() {
            let value = this.props.value
            console.log('ajax value=', value)
            fetch('/dict.json')
            .then(response => response.json())
            .then(data => {
                console.log('ajax value2=', value)
                console.log('ajax this.props.value=', this.props.value)
                this.setState({value: data[this.props.value]})
            })
        }
        render() {
            console.log('ajax render state value', this.state.value)
            return <OldComponent value={this.state.value} />
        }
    }
}
const UserName = (props) => {
    return <input defaultValue={props.value} />
}
// const Password = (props) => {
//     return <input defaultValue={props.value} />
// }
const AjaxUserName = loadFromAjax(UserName)
//console.log(<AjaxUserName />)
let LocalUserName = loadFromLocalStore(AjaxUserName, 'username')
//let LocalPassword = loadFromLocalStore(Password, 'password')

ReactDOM.render(
<div>
    <LocalUserName />
    {/* <AjaxUserName /> */}
</div>, document.getElementById('root'))
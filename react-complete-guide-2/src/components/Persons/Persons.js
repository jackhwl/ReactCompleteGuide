import React, {Component} from 'react'
import Person from './Person/Person'

class Persons extends Component {
    // static getDerivedStateFromProps(props, state){
    //     console.log('[Persons.js] getDerivedStateFromProps', props)
    //     return state;
    // }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('[Persons.js] shouldComponentUpdate')
        return true
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log('[Persons.js] getSnapshotBeforeUpdate')
        return { message: 'Snapshot!'}
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('[Persons.js] componentDidUpdate')
        console.log(snapshot)
    }
    render(){
        console.log('[Persons.js] rendering...')
        return this.props.persons.map((p, index) => {
            return <Person 
                name={p.name} 
                age={p.age}  
                key={p.id}
                changed={(event) => this.props.changed(event, p.id)}
                click={()=>this.props.clicked(index)} />

            }    
        )}
    }
export default Persons

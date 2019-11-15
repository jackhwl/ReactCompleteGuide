import React from 'react'
import Person from './Person/Person'

const Persons = (props) => props.persons.map((p, index) => {
        return <Person 
            name={p.name} 
            age={p.age}  
            key={p.id}
            changed={(event) => props.changed(event, p.id)}
            click={()=>props.clicked(index)} />
    })

export default Persons

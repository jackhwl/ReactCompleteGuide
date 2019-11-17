import React, { useEffect } from 'react'
import classes from './Cockpit.module.css'

const Cockpit = (props) => {
    useEffect(() => {
      console.log('[Cockpit.js] useEffect');
      // http request
      const timer = setTimeout(() => {
        alert('Saved data to cloud')
      }, 1000)
      return () => {
        clearTimeout(timer);
        console.log('[Cockpit.js] cleanup work in useEffect')
      }
    }, [])  // [] only run first time, [props.persons] run whenever persons changes
    useEffect(() => {
      console.log('[Cockpit.js] 2nd useEffect');
      return () => {
        console.log('[Cockpit.js] cleanup work in 2nd useEffect')
      }
    })  // without [], it'll clean everytime after update

    const assignedClasses = []
    let btnClass = ''
    if (props.showPersons){
        btnClass = classes.Red
    }
    if (props.persons.length <=2){
      assignedClasses.push(classes.red)
    }
    if (props.persons.length <=1){
      assignedClasses.push(classes.bold)
    }
    
    return (
        <div className={classes.Cockpit}>
            <h1>{props.title}</h1>
            <p className={assignedClasses.join(' ')}>This is really working!</p>
            <button 
                className={btnClass} 
                onClick={props.clicked}>toggle persons</button>
        </div>
    )
}

export default Cockpit

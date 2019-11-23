import React from 'react'
import classes from './NavigationItems.module.css'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = () => {
    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem>Burger Builder</NavigationItem>
            <NavigationItem>Burger Builder</NavigationItem>
        </ul>
    )
}

export default navigationItems

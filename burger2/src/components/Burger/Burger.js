import React from 'react'
import classes from './Burger.module.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
    console.log('props.ingredients=', props.ingredients)
    // let ab = Object.keys(props.ingredients)
    //     .map(igKey => [...Array(props.ingredients[igKey])].map((_,i) => i))
    // console.log('ab=',ab)
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => 
                <BurgerIngredient key={igKey + i} type={igKey} />   
            )
        })
        .reduce((arr, el) => arr.concat(el),[])
    console.log(transformedIngredients)
    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please start adding ingredients!</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    )
}

export default burger

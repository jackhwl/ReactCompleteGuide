import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Aux from '../../hoc/Auxlib/Auxlib'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/'
import axios from '../../axios-orders'

const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false)
    const {onInitIngredients} = props
    useEffect(() => {
        onInitIngredients()
    }, [onInitIngredients])
    
    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum, el) => sum + el, 0)
        return sum > 0
    }
    // addIngredientHandler = (type) => {
    //     const oldCount = this.props.ingredients[type]
    //     const updatedCount = oldCount + 1
    //     const updatedIngredients = {
    //         ...this.props.ingredients
    //     }
    //     updatedIngredients[type] = updatedCount
    //     const priceAddition = INGREDIENT_PRICES[type]
    //     const oldPrice = this.props.totalPrice
    //     const newPrice = oldPrice + priceAddition
    //     this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
    //     this.updatePurchaseState(updatedIngredients)
    // }
    // removeIngredientHandler = (type) => {
    //     const oldCount = this.props.ingredients[type]
    //     const updatedCount = oldCount > 0 ? oldCount - 1 : 0
    //     const updatedIngredients = {
    //         ...this.props.ingredients
    //     }
    //     updatedIngredients[type] = updatedCount
    //     const priceAddition = INGREDIENT_PRICES[type]
    //     const oldPrice = this.props.totalPrice
    //     const newPrice = oldPrice - priceAddition
    //     this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
    //     this.updatePurchaseState(updatedIngredients)
    // }    
    const purchaeHandler = () => {
        if (props.isAuth) {
            setPurchasing(true)  
        } else {
            props.onSetAuthRedirectPath('/checkout')
            props.history.push('/auth')
        }
        
    }
    const purchaeCancelHandler = () => {
        setPurchasing(false)
    }    
    const purchaeContinueHandler = () => {
        props.onInitPurchase()
        props.history.push('/checkout')
        // const queryParams = [];
        // for (let i in this.props.ingredients){
        //     queryParams.push(encodeURIComponent(i)+ '=' + encodeURIComponent(this.props.ingredients[i]))
        // }
        // queryParams.push('price=' + this.props.totalPrice)
        // const queryString = queryParams.join('&')
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // })
    }    

    const disabledInfo = {
        ...props.ingredients
    }
    for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null
    let burger = props.error ? <p>Ingredients can't be loaded! {props.error.message}</p> : <Spinner />
    if (props.ingredients){
        burger = (
        <Aux>
            <Burger ingredients={props.ingredients}/>
            <BuildControls
                ingredientAdded={props.onIngredientAdded} 
                ingredientRemoved={props.onIngredientRemoved} 
                disabled={disabledInfo}
                price={props.totalPrice}
                purchasable={updatePurchaseState(props.ingredients)}
                isAuth={props.isAuth}
                ordered={purchaeHandler}
                />
        </Aux>
        ) 
        orderSummary = <OrderSummary 
                    ingredients={props.ingredients}
                    price={props.totalPrice}
                    purchaseCancelled={purchaeCancelHandler}
                    purchaseContinued={purchaeContinueHandler} />
    }
    
    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaeCancelHandler}>
                { orderSummary }
            </Modal>
            {burger}
        </Aux>
    )
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuth: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))

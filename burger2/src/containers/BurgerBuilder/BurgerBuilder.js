import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector, useCallback } from 'react-redux'
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

    const dispatch = useDispatch()

    const ingredients = useSelector(state => state.burgerBuilder.ingredients)
    const totalPrice = useSelector(state => state.burgerBuilder.totalPrice)
    const error = useSelector(state => state.burgerBuilder.error)
    const isAuth = useSelector(state => state.auth.token !== null)    

    const onIngredientAdded = (ingredientName) => dispatch(actions.addIngredient(ingredientName))
    const onIngredientRemoved = (ingredientName) => dispatch(actions.removeIngredient(ingredientName))
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch])
    const onInitPurchase = () => dispatch(actions.purchaseInit())
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path))

    //const {onInitIngredients} = props
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
        if (isAuth) {
            setPurchasing(true)  
        } else {
            onSetAuthRedirectPath('/checkout')
            props.history.push('/auth')
        }
        
    }
    const purchaeCancelHandler = () => {
        setPurchasing(false)
    }    
    const purchaeContinueHandler = () => {
        onInitPurchase()
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
        ...ingredients
    }
    for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null
    let burger = error ? <p>Ingredients can't be loaded! {error.message}</p> : <Spinner />
    if (ingredients){
        burger = (
        <Aux>
            <Burger ingredients={ingredients}/>
            <BuildControls
                ingredientAdded={onIngredientAdded} 
                ingredientRemoved={onIngredientRemoved} 
                disabled={disabledInfo}
                price={totalPrice}
                purchasable={updatePurchaseState(ingredients)}
                isAuth={isAuth}
                ordered={purchaeHandler}
                />
        </Aux>
        ) 
        orderSummary = <OrderSummary 
                    ingredients={ingredients}
                    price={totalPrice}
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

// const mapStateToProps = state => {
//     return {
//         ingredients: state.burgerBuilder.ingredients,
//         totalPrice: state.burgerBuilder.totalPrice,
//         error: state.burgerBuilder.error,
//         isAuth: state.auth.token !== null
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
//         onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
//         onInitIngredients: () => dispatch(actions.initIngredients()),
//         onInitPurchase: () => dispatch(actions.purchaseInit()),
//         onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
//     }
// }

//export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))

export default withErrorHandler(BurgerBuilder, axios)
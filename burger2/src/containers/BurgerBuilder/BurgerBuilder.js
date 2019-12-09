import React, { Component } from 'react'
import { connect } from 'react-redux'
import Aux from '../../hoc/Auxlib/Auxlib'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as burgerBuilderActions from '../../store/actions/'
import axios from '../../axios-orders'

class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }

    componentDidMount() {

    }
    updatePurchaseState (ingredients) {
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
    purchaeHandler = () => {
        this.setState({purchasing: true})
    }
    purchaeCancelHandler = () => {
        this.setState({purchasing: false})
    }    
    purchaeContinueHandler = () => {
        this.props.history.push('/checkout')
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
    render() {
        const disabledInfo = {
            ...this.props.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null
        let burger = this.state.error ? <p>Ingredients can't be loaded! {this.state.error.message}</p> : <Spinner />
        if (this.props.ingredients){
            burger = (
            <Aux>
                <Burger ingredients={this.props.ingredients}/>
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded} 
                    ingredientRemoved={this.props.onIngredientRemoved} 
                    disabled={disabledInfo}
                    price={this.props.totalPrice}
                    purchasable={this.updatePurchaseState(this.props.ingredients)}
                    ordered={this.purchaeHandler}
                    />
            </Aux>
            ) 
            orderSummary = <OrderSummary 
                        ingredients={this.props.ingredients}
                        price={this.props.totalPrice}
                        purchaseCancelled={this.purchaeCancelHandler}
                        purchaseContinued={this.purchaeContinueHandler} />
        }
        
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaeCancelHandler}>
                    { orderSummary }
                </Modal>
                {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(burgerBuilderActions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(burgerBuilderActions.removeIngredient(ingredientName))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Aux from '../../hoc/Auxlib/Auxlib'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'
import * as actionTypes from '../../store/actions'

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.4,
    cheese: 1.3,
    meat: 0.7
}
class BurgerBuilder extends Component {
    state = {
        //ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: null
    }

    componentDidMount() {
        // axios.get('https://react-my-burger-66316.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data})
        //     })
        //     .catch(error => this.setState({error}))
    }
    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum, el) => sum + el, 0)
        this.setState({purchasable: sum > 0})
    }
    addIngredientHandler = (type) => {
        const oldCount = this.props.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.props.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
        this.updatePurchaseState(updatedIngredients)
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.props.ingredients[type]
        const updatedCount = oldCount > 0 ? oldCount - 1 : 0
        const updatedIngredients = {
            ...this.props.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice - priceAddition
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
        this.updatePurchaseState(updatedIngredients)
    }    
    purchaeHandler = () => {
        this.setState({purchasing: true})
    }
    purchaeCancelHandler = () => {
        this.setState({purchasing: false})
    }    
    purchaeContinueHandler = () => {

        const queryParams = [];
        for (let i in this.props.ingredients){
            queryParams.push(encodeURIComponent(i)+ '=' + encodeURIComponent(this.props.ingredients[i]))
        }
        queryParams.push('price=' + this.state.totalPrice)
        const queryString = queryParams.join('&')
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })
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
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaeHandler}
                    />
            </Aux>
            ) 
            orderSummary = <OrderSummary 
                        ingredients={this.props.ingredients}
                        price={this.state.totalPrice}
                        purchaseCancelled={this.purchaeCancelHandler}
                        purchaseContinued={this.purchaeContinueHandler} />
        }
        if (this.state.loading){
            orderSummary = <Spinner />
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
        ingredients: state.ingredients
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName}),
        onIngredientRemoved: (ingredientName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))

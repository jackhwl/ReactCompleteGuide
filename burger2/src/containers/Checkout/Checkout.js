import React, { Component } from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'

class Checkout extends Component {
    state = {
        ingredients: {
            salad: 0,
            meat: 1,
            cheese: 1,
            bacon: 1
        }
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search)
        const ingredients = {}
        for (let param of query.entries()) {
            //['salad', '1']
            ingredients[param[0]] = param[1]
        }
        console.log(ingredients) 
        this.setState({ingredients: ingredients})
    }

    checkoutCancelHandler = () => {
        this.props.history.goBack()
    }    

    checkoutContinueHandler = () => {
        this.props.history.replace('/checkout/contact-data')
    }    

    render() {
        return (
            <div>
                <CheckoutSummary 
                    checkoutCancelled={this.checkoutCancelHandler}
                    checkoutContinued={this.checkoutContinueHandler}
                    ingredients={this.state.ingredients} />
            </div>
        )
    }
}

export default Checkout

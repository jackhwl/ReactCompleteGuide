import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'


class Checkout extends Component {
    state = {
        ingredients: null,
        price: 0
    }

    componentWillMount() {
        const query = new URLSearchParams(this.props.location.search)
        const ingredients = {}
        let price = 0
        for (let param of query.entries()) {
            //['salad', '1']
            if (param[0] === 'price') {
                price = param[1]
            } else {
                ingredients[param[0]] = +param[1]
            }
        }
        console.log(ingredients) 
        this.setState({ingredients, totalPrice: price})
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
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    render={ (props) => <ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />} />
            </div>
        )
    }
}

export default Checkout

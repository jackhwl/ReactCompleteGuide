import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'
import { connect } from 'react-redux'

class Checkout extends Component {
    // state = {
    //     ingredients: null,
    //     totalPrice: 0
    // }

    // componentWillMount() {
    //     const query = new URLSearchParams(this.props.location.search)
    //     const ingredients = {}
    //     let price = 0
    //     for (let param of query.entries()) {
    //         //['salad', '1']
    //         if (param[0] === 'price') {
    //             price = param[1]
    //         } else {
    //             ingredients[param[0]] = +param[1]
    //         }
    //     }
    //     console.log(ingredients) 
    //     this.setState({ingredients, totalPrice: price})
    // }

    checkoutCancelHandler = () => {
        this.props.history.goBack()
    }    

    checkoutContinueHandler = () => {
        this.props.history.replace('/checkout/contact-data')
    }    

    render() {
        let summary = <Redirect to="/" />
        if (this.props.ingredients) {
            summary = (
                <div>
                    <CheckoutSummary 
                        checkoutCancelled={this.checkoutCancelHandler}
                        checkoutContinued={this.checkoutContinueHandler}
                        ingredients={this.props.ingredients} />
                    <Route 
                        path={this.props.match.path + '/contact-data'} 
                        component={ContactData}
                        // render={ (props) => <ContactData ingredients={this.props.ingredients} price={this.props.totalPrice} {...props} />}
                        />
                </div>
            )
        }
        return summary
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients
    }
}

export default connect(mapStateToProps)(Checkout)

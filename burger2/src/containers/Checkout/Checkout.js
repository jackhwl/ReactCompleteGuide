import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'
import { connect } from 'react-redux'
//import * as actions from '../../store/actions'

const Checkout = props => {
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
    const checkoutCancelHandler = () => {
        props.history.goBack()
    }    

    const checkoutContinueHandler = () => {
        props.history.replace('/checkout/contact-data')
    }    


        let summary = <Redirect to="/" />
        if (props.ingredients) {
            const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary 
                        checkoutCancelled={checkoutCancelHandler}
                        checkoutContinued={checkoutContinueHandler}
                        ingredients={props.ingredients} />
                    <Route 
                        path={props.match.path + '/contact-data'} 
                        component={ContactData}
                        // render={ (props) => <ContactData ingredients={this.props.ingredients} price={this.props.totalPrice} {...props} />}
                        />
                </div>
            )
        }
        return summary
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps)(Checkout)

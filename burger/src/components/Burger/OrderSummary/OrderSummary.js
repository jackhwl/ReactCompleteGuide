import React from 'react';
import Aux from '../../../hoc/Auxlib';

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igKey => 
                <li key={igKey}>
                    <span style={{textTransform:'capitalize'}}>{igKey}:</span> {props.ingredients[igKey]}
                </li>
            );
    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the follwing ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>Continue to Checkout?</p>
        </Aux>
    );
};

export default orderSummary;
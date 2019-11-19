import React from 'react'
import {Product} from './types'
interface Props {
    product: Product | null | undefined
}
function ProductList(props: Props) {
    let product = props.product;
    if (!product) return null;
    return (
        <ul className="list-group">
            <li className="list-group-item">ID: {product.id}</li>
            <li className="list-group-item">name: {product.name}</li>
            <li className="list-group-item">category name: {product.category!.name}</li>
            <li className="list-group-item">
                all products in the category
                <ul className="list-group">
                {
                     product.category!.products!.map((item:Product) => (
                        <li key={item.id} className="list-group-item">{item.name}</li>
                     ))
                 }
                </ul>
            </li>
        </ul>
    )
}

export default ProductList

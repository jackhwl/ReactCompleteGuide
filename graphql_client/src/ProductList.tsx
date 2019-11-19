import React from 'react'
import {Product} from './types'
interface Props {
    products: Array<Product>
    setProduct: any
}
function ProductList(props: Props) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    } 
    return (
        <table className="table table-striped">
             <caption className="text-center">product list</caption>
             <thead>
                 <tr><td>name</td><td>category</td></tr>
             </thead>
             <tbody>
                 {
                     props.products.map((item:Product) => (
                         <tr onClick={() => props.setProduct(item)} key={item.id}>
                             <td>{item.name}</td><td>{item.category!.name}</td>
                         </tr>
                     ))
                 }
             </tbody>
        </table>
    )
}

export default ProductList

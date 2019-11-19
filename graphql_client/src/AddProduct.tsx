import React, {useState} from 'react'
import {Category, Product} from './types'
import {useMutation} from '@apollo/react-hooks'
import {ADD_PRODUCT, GET_PRODUCTS} from './query'
interface Props {
    categories: Array<Category>
}
function AddProduct(props: Props) {
    let [product, setProduct] = useState<Product>({name:'', categoryId:''})
    let [addProduct] = useMutation(ADD_PRODUCT)
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        addProduct({variables: product, refetchQueries: [{query: GET_PRODUCTS}]})
    }
    return (
        <form onSubmit={handleSubmit} >
            <div className="form-group">
                <label>Product Name</label>
                <input value={product.name} 
                onChange={event => setProduct({...product, name: event.target.value})}
                type="text" className="form-control"/>
            </div>
            <div className="form-group">
                <label>Product Category</label>
                <select value={product.name} 
                onChange={event => setProduct({...product, categoryId: event.target.value})}
                className="form-control">
                    <option value="">please select</option>
                    {
                    props.categories.map((item:Category) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))
                    }
                </select>
            </div>
            <div className="form-group">
                <input type="submit" className="btn btn-primary"/>
            </div>
        </form >
    )
}

export default AddProduct

import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import AddProduct from './AddProduct'
import ProductList from './ProductList'
import ProductDetail from './ProductDetail'
import {useQuery} from '@apollo/react-hooks'
import {CATEGORIES_PRODUCT} from './query'
import {Product} from './types'
function App() {
    let [product, setProduct] = useState<Product>()
    const {loading, error, data} = useQuery(CATEGORIES_PRODUCT)
    if(error) {
        return <p>loading error!</p>
    }
    if(loading) {
        return <p>loading....</p>
    }
    const {getCategories, getProducts} = data
    //console.log('data', data)
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <AddProduct categories={getCategories} />
                        </div>
                        <div className="panel-body">
                            <ProductList products={getProducts} setProduct={setProduct} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <ProductDetail product={product} /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
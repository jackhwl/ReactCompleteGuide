import React, { useState, useEffect, useCallback } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredients)
  }, [ingredients])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients)
  }, [])

  const addIngredientHandler = ingredient => {
    setIsLoading(true)
    fetch('https://react-hoos-update.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      setIsLoading(false)
      return response.json()
    })
    .then(responseData => {
      setIngredients(prevIngredients => [
        ...prevIngredients, 
        {id: responseData.name, ...ingredient}
      ])
    })
    
  }

  const removeIngredientHandler = id => {
    setIsLoading(true)
    fetch(`https://react-hoos-update.firebaseio.com/ingredients/${id}.son`, {
      method: 'DELETE'
    }).then(response => {
        setIsLoading(false)
        setIngredients(prevIngredients => 
        prevIngredients.filter(ig => ig.id !== id )
      )
    }).catch(error => {
      setError('something went wrong:' + error.message)
      setIsLoading(false)
    })
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        loading={isLoading}
        onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;

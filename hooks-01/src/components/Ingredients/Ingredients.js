import React, { useReducer, useEffect, useCallback, useMemo } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ig => ig.id !== action.id)
    default:
      throw new Error('Should not get there!')
  }
}

const httpReducer = (currentHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...currentHttpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR':
      return { ...currentHttpState, error: null }
    default:
      throw new Error('Should not be reached!')
  }
}

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  // const [ingredients, setIngredients] = useState([])
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null })
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState()

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredients)
  }, [ingredients])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients})
    // setIngredients(filteredIngredients)
  }, [])

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({type: 'SEND'})
    //setIsLoading(true)
    fetch('https://react-hoos-update.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'})
      //setIsLoading(false)
      return response.json()
    })
    .then(responseData => {
      dispatch({
        type: 'ADD', 
        ingredient: {id: responseData.name, ...ingredient}
      })
      // setIngredients(prevIngredients => [
      //   ...prevIngredients, 
      //   {id: responseData.name, ...ingredient}
      // ])
    })
    
  }, [])

  const removeIngredientHandler = useCallback(id => {
    dispatchHttp({type: 'SEND'})
    //setIsLoading(true)
    fetch(`https://react-hoos-update.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'})  
      //setIsLoading(false)
      dispatch({type: 'DELETE', id})
      // setIngredients(prevIngredients => 
      //   prevIngredients.filter(ig => ig.id !== id )
      // )
    }).catch(error => {
      dispatchHttp({type: 'ERROR', errorMessage: 'something went wrong:' + error.message})
      // setError('something went wrong:' + error.message)
      // setIsLoading(false)
    })
  }, [])

  const clearError = useCallback(() => {
    dispatchHttp({type: 'CLEAR'})
    //setError(null)
  },[])

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
    )
  }, [useIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm 
        loading={httpState.loading}
        onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;

import React, { useReducer, useEffect, useCallback, useMemo } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';
import useHttp from '../../hooks/http'

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


const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifer, clear } = useHttp();
  // const [ingredients, setIngredients] = useState([])

  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState()

  useEffect(() => {
    if (!isLoading && !error && reqIdentifer === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra })
    } else if (!isLoading && !error && data && reqIdentifer === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD', 
        ingredient: {id: data.name, ...reqExtra}
      })
    }
  }, [data, reqExtra, reqIdentifer, isLoading, error])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients})
    // setIngredients(filteredIngredients)
  }, [])

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      `https://react-hoos-update.firebaseio.com/ingredients.json`, 
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
    // dispatchHttp({type: 'SEND'})
    // //setIsLoading(true)
    // fetch('https://react-hoos-update.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: {'Content-Type': 'application/json'}
    // }).then(response => {
    //   dispatchHttp({type: 'RESPONSE'})
    //   //setIsLoading(false)
    //   return response.json()
    // })
    // .then(responseData => {
    //   dispatch({
    //     type: 'ADD', 
    //     ingredient: {id: responseData.name, ...ingredient}
    //   })
    //   // setIngredients(prevIngredients => [
    //   //   ...prevIngredients, 
    //   //   {id: responseData.name, ...ingredient}
    //   // ])
    // })
    
  }, [])

  const removeIngredientHandler = useCallback(id => {
    sendRequest(
      `https://react-hoos-update.firebaseio.com/ingredients/${id}.json`, 
      'DELETE',
      null,
      id,
      'REMOVE_INGREDIENT'
    )
  }, [sendRequest])

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
    )
  }, [ingredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm 
        loading={isLoading}
        onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;

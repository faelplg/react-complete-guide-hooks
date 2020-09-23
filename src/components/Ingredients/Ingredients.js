import React, {useReducer, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error('Should not get here!');
  }
};

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...currHttpState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.errorMessage};
    case 'CLEAR':
      return {...currHttpState, error: null};
    default:
      throw new Error('Should not get here!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log('[RENDERING INGREDIENTS]', userIngredients);
    return () => {
      console.log('[Cleaning]');
    };
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);

  const addIngredientHandler = (ingredient) => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    // Firebase requires a .json
    // Firebase will generate an ID for us
    // Fetch runs a GET method by default
    // Fetch returns a Promise
    // Axios do the JSON convertion and Header setup for us
    fetch('https://react-hooks-update-5a74c.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'},
    })
      .then((response) => {
        // setIsLoading(false);
        dispatchHttp({type: 'RESPONSE'});
        // The response from Firebase returns a promise
        return response.json();
      })
      .then((responseData) => {
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   {id: responseData.name, ...ingredient},
        // ]);
        dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
      });
  };

  const removeItemHandler = (itemId) => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    fetch(`https://react-hooks-update-5a74c.firebaseio.com/ingredients/${itemId}.json`, {
      method: 'DELETE',
    })
      .then((response) => {
        // setIsLoading(false);
        dispatchHttp({type: 'RESPONSE'});
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((item) => item.id !== itemId),
        // );
        dispatch({type: 'DELETE', id: itemId});
      })
      .catch((error) => {
        // setError(error.message);
        // setError('Something went wrong!');
        // setIsLoading(false);
        dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'});
      });
  };

  const clearError = () => {
    // setError(null);
    dispatchHttp({type: 'CLEAR'});
  };

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeItemHandler} />
      </section>
    </div>
  );
};

export default Ingredients;

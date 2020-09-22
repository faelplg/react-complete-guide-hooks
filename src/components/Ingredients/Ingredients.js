import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  // useEffect(() => {
  //   fetch('https://react-hooks-update-5a74c.firebaseio.com/ingredients.json')
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       const loadedIngredients = [];
  //       // Every key will be an unique ID
  //       for (const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount,
  //         });
  //       }
  //       setUserIngredients(loadedIngredients);
  //     });
  // }, []);

  useEffect(() => {
    console.log('[RENDERING INGREDIENTS]', userIngredients);
    return () => {
      console.log('[Cleaning]');
    }
  }, [userIngredients]);

  const filteredIngredientsHnalder = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = (ingredient) => {
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
        // The response from Firebase returns a promise
        return response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          {id: responseData.name, ...ingredient},
        ]);
      });
  };

  const removeItemHandler = (itemId) => {
    setUserIngredients((prevIngredients) => prevIngredients.filter((item) => item.id !== itemId));
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHnalder} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeItemHandler} />
      </section>
    </div>
  );
};

export default Ingredients;

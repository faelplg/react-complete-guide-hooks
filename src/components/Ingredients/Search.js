import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo((props) => {
  const {onLoadIngredients} = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch('https://react-hooks-update-5a74c.firebaseio.com/ingredients.json' + query)
          .then((response) => response.json())
          .then((responseData) => {
            const loadedIngredients = [];
            // Every key will be an unique ID
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      // will run for the previous effect before the new effect is applied
      // clear the previous timer
      clearTimeout(timer);
    }
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;

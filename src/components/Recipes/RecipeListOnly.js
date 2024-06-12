import React, { useEffect, useState } from "react";
import RecipeItem from "./RecipeItem";

function isValidData(data) {
  return data !== null && data.data !== undefined && data.data !== null && data.data.length !== 0;
}

const NoData = () => (
  <div>No recipes found.</div>
);

const RecipeListOnly = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      const API_ROOT = '/jsonapi/';
      const url = `${API_ROOT}views/recipes/page_1`;
      
      const headers = new Headers({ Accept: 'application/vnd.api+json' });

      try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        if (isValidData(data)) {
          setRecipes(data.data);
        }
      } catch (error) {
        console.log('There was an error accessing the API', error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const API_ROOT = '/jsonapi/';
      const url = `${API_ROOT}/node/recipe?include=field_image`;
      
      const headers = new Headers({ Accept: 'application/vnd.api+json' });

      try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        console.log(data.included)
        if (isValidData(data)) {
          setImages(data);
        }
      } catch (error) {
        console.log('There was an error accessing the API', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchIngredients = async () => {
      const API_ROOT = '/jsonapi/';
      const url = `${API_ROOT}taxonomy_term/ingredients`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const formattedIngredients = data.data.map(item => ({
          id: item.id,
          name: item.attributes.name
        }));
        setIngredients(formattedIngredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <div>
      <h2>Site Recipes</h2>
      {recipes ? (
        <>
          <label htmlFor="filter">Type to filter:</label>
          <input
            type="text"
            name="filter"
            placeholder="Start typing ..."
            onChange={(event => setFilter(event.target.value.toLowerCase()))}
          />
          <hr />
          {recipes
            .filter((item) => {
              if (!filter) {
                return item;
              }
              if (filter && item.attributes.title.toLowerCase().includes(filter)) {
                return item;
              }
            })
            .map((item) => (
              <RecipeItem
                key={item.id}
                nodeId={item.attributes.drupal_internal__nid}
                title={item.attributes.title}
                ingredientsIds={item.relationships.field_ingredients.data.map(ingredient => ingredient.id)}
                allIngredients={ingredients}
              />
            ))
          }
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default RecipeListOnly;

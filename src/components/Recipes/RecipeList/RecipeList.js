import React, { useEffect, useState } from "react";
import RecipeItem from "../RecipeItem/RecipeItem";
import './style.scss';

function isValidData(data) {
  return data !== null && data.data !== undefined && data.data.length !== 0;
}

const NoData = () => (
  <div>No recipes found.</div>
);

const RecipeList = () => {
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
        
        if (data.included) {
          const recipeImageData = data.included.map(item => ({
            id: item.id,
            filename: item.attributes.filename,
            url: item.attributes.uri.url,
            value: item.attributes.uri.value
          }));
          setImages(recipeImageData);
          console.log('recipe Image Data', recipeImageData)
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
  console.log('recipes', recipes)
  return (
    <div>
      <h2>Site Recipes</h2>
      {recipes.length > 0 ? (
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
                return true;
              }
              return item.attributes.title.toLowerCase().includes(filter);
            })
            .map((item) => (
              <RecipeItem
                key={item.id}
                nodeId={item.attributes.drupal_internal__nid}
                title={item.attributes.title}
                ingredientsIds={item.relationships.field_ingredients.data.map(ingredient => ingredient.id)}
                allIngredients={ingredients}
                recipeImageId={item.relationships.field_image.data.id}
                imageValues={images}
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

export default RecipeList;

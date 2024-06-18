import React, { useEffect, useState } from "react";
import RecipeItem from "../RecipeItem/RecipeItem";
import useFetchRecipes from "../../../utils/useFetchRecipes";
import useFetchImages from "../../../utils/useFetchImages";
import useFetchIngredients from "../../../utils/useFetchIngredients";
import './style.scss';

const NoData = () => (
  <div>No recipes found.</div>
);

const RecipeList = () => {

  const [filter, setFilter] = useState(null);

  const recipes = useFetchRecipes('views/recipes/page_1');
  const images = useFetchImages('/node/recipe?include=field_image');
  const ingredients = useFetchIngredients('taxonomy_term/ingredients');
  
  return (
    <div>
      <h2>Site Recipes</h2>
      {recipes.length > 0 ? (
        <>
          <div className="recipes__filter">
            <input
              type="text"
              name="filter"
              placeholder="What are you looking for ?"
              onChange={(event => setFilter(event.target.value.toLowerCase()))}
            />
          </div>
          <div className="recipes__container">
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
                  nid={item.attributes.drupal_internal__nid}
                  title={item.attributes.title}
                  ingredientsIds={item.relationships.field_ingredients.data.map(ingredient => ingredient.id)}
                  allIngredients={ingredients}
                  recipeImageId={item.relationships.field_image.data.id}
                  imageValues={images}
                />
              ))
            }
          </div>
        </>
      ) : (
        <NoData />
      )}

    </div>
  );
};

export default RecipeList;
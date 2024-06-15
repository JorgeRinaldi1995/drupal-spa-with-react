import React, { useEffect, useState } from "react";
import './style.scss';

const RecipeItem = ({ nodeId, title, ingredientsIds, allIngredients, recipeImageId, imageValues }) => {
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [recipeImage, setRecipeImage] = useState(null);

  useEffect(() => {
    const filtered = allIngredients.filter(ingredient =>
      ingredientsIds.includes(ingredient.id)
    );
    setFilteredIngredients(filtered);
  }, [ingredientsIds, allIngredients]);

  useEffect(() => {
    if (recipeImageId && imageValues) {
      const imageData = imageValues.find(item => item.id === recipeImageId);
      setRecipeImage(imageData);
    }
  }, [recipeImageId, imageValues]);

  console.log('recipeImage:', recipeImage, 'imageValues:', imageValues);

  return (
    <a href={`/node/${nodeId}`} className="recipe__item">
      <article className="recipe__article">
        {recipeImage && (
          <img src={recipeImage.url} alt={recipeImage.filename} className="recipe__img" />
        )}
        <div class="recipe__data">
          <h2>{title}</h2>
          <ul>
            {filteredIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient.name}</li>
            ))}
          </ul>
        </div>
      </article>
    </a>
  );
};

export default RecipeItem;

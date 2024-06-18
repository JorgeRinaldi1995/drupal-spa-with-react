import React, { useEffect, useState } from "react";
import './style.scss';
import { Link } from 'react-router-dom';

const RecipeItem = ({ uuid, nid, title, ingredientsIds, allIngredients, recipeImageId, imageValues }) => {
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

  return (
    <Link to={`/recipe/${uuid}`} className="recipe__item">
      <article className="recipe__article" id={nid}>
        {recipeImage && (
          <img src={recipeImage.url} alt={recipeImage.filename} className="recipe__img" />
        )}
        <div className="recipe__data">
          <h2>{title}</h2>
          <ul className="recipe__ingredients">
            {filteredIngredients.map((ingredient, index) => (
              <li className="recipe__ingredient" key={index}>{ingredient.name}</li>
            ))}
          </ul>
        </div>
      </article>
    </Link>
  );
};

export default RecipeItem;

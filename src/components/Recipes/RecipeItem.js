import React, { useEffect, useState } from "react";

const RecipeItem = ({ nodeId, title, ingredientsIds, allIngredients }) => {
  const [filteredIngredients, setFilteredIngredients] = useState([]);

  useEffect(() => {
    const filtered = allIngredients.filter(ingredient =>
      ingredientsIds.includes(ingredient.id)
    );
    setFilteredIngredients(filtered);
  }, [ingredientsIds, allIngredients]);

  return (
    <div>
      <a href={`/node/${nodeId}`}>
        <h2>{title}</h2>
      </a>
      <ul>
        {filteredIngredients.map((ingredient, index) => (
          <li key={index}>{ingredient.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeItem;
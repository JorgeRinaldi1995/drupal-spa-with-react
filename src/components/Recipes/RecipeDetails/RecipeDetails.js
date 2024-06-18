import React from "react";
import { useParams } from "react-router-dom"
import useFetchRecipes from "../../../utils/useFetchRecipes";
import useFetchImages from "../../../utils/useFetchImages";
import useFetchIngredients from "../../../utils/useFetchIngredients";

const RecipeDetails = () => {
    const { uuid } = useParams();

    const recipeDetails = useFetchRecipes(`node/recipe/${uuid}`);
    const images = useFetchImages('/node/recipe?include=field_image');
    const ingredients = useFetchIngredients('taxonomy_term/ingredients');

    const recipeImage = images.find(image => image.id === recipeDetails.recipeImageId);
    const filteredIngredients = ingredients.filter(ingredient => recipeDetails.ingredientsIds.includes(ingredient.id));

    return (
        <>
            <h1>{recipeDetails.title}</h1>
            {recipeImage && (
                <img src={recipeImage.url} alt={recipeImage.filename} />
            )}
            <h3>Ingredients</h3>
            <ul>
                {filteredIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name}</li>
                ))}
            </ul>
        </>
    );
}

export default RecipeDetails;
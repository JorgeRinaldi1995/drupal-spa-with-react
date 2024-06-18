import React from "react";
import { useParams } from "react-router-dom"
import useFetchRecipes from "../../../utils/useFetchRecipes";
import useFetchImages from "../../../utils/useFetchImages";
import useFetchIngredients from "../../../utils/useFetchIngredients";
import DOMPurify from 'dompurify';

const RecipeDetails = () => {
    const { uuid } = useParams();

    const recipeDetails = useFetchRecipes(`node/recipe/${uuid}`);
    const images = useFetchImages('/node/recipe?include=field_image');
    const ingredients = useFetchIngredients('taxonomy_term/ingredients');

    const recipeImage = images.find(image => image.id === recipeDetails.recipeImageId);
    const filteredIngredients = ingredients.filter(ingredient => recipeDetails.ingredientsIds.includes(ingredient.id));

    return (
        <>
            {recipeImage && (
                <img src={recipeImage.url} alt={recipeImage.filename} />
            )}
            <h1>{recipeDetails.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recipeDetails.body) }}></div>
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
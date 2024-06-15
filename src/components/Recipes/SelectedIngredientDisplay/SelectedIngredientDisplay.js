import React from 'react';

const SelectedIngredientDisplay = ({ ingredients }) => {
    return (
        <div>
            <h3>Selected Ingredients:</h3>
            <ul>
                {ingredients.map(ingredient => (
                    <li key={ingredient.internal_tid}>{ingredient.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SelectedIngredientDisplay;

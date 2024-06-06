import React, { useEffect, useState } from 'react';

const IngredientSelect = ({ onIngredientChange }) => {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        fetch('http://react-in-drupal.lndo.site/jsonapi/taxonomy_term/ingredients')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch ingredients');
                }
                return response.json();
            })
            .then(data => {
                const ingredients = data.data.map(item => ({
                    id: item.id,
                    internal_tid: item.attributes.drupal_internal__tid,
                    name: item.attributes.name
                }));
                setIngredients(ingredients);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleChange = (event) => {
        const selectedinternal_tid = parseInt(event.target.value, 10); // Convert to number
        console.log('Selected internal_tid:', selectedinternal_tid); // Debug log
        if (selectedinternal_tid) {
            const selectedIngredient = ingredients.find(ingredient => {
                console.log('Ingredient internal_tid:', ingredient.internal_tid);
                return ingredient.internal_tid === selectedinternal_tid; // Use regular equality operator
            });
            
            console.log('Selected Ingredient:', selectedIngredient); // Debug log
            if (selectedIngredient) {
                onIngredientChange(selectedIngredient);
            } else {
                console.log('Ingredient not found'); // Debug log
            }
        } else {
            console.log('No internal_tid selected'); // Debug log
        }
    };

    return (
        <select onChange={handleChange}>
            <option value="">Select an ingredient</option>
            {ingredients.map(ingredient => (
                <option key={ingredient.internal_tid} value={ingredient.internal_tid}>
                    {ingredient.name}
                </option>
            ))}
        </select>
    );
};

export default IngredientSelect;

import React, { useEffect, useState } from 'react';

const IngredientSelect = ({ onIngredientAdd }) => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredientId, setSelectedIngredientId] = useState('');

    useEffect(() => {
        fetch('https://react-in-drupal.lndo.site/jsonapi/taxonomy_term/ingredients')
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
        setSelectedIngredientId(Number(event.target.value));
    }

    const handleAddIngredient = () => {
        if (selectedIngredientId) {
            const selectedIngredient = ingredients.find(ingredient => ingredient.internal_tid === selectedIngredientId);
            if (selectedIngredient) {
                onIngredientAdd(selectedIngredient);
            }
        }
    };

    return (
        <div>
            <select onChange={handleChange} value={selectedIngredientId}>
                <option value="">Select an ingredient</option>
                {ingredients.map(ingredient => (
                    <option key={ingredient.internal_tid} value={ingredient.internal_tid}>
                        {ingredient.name}
                    </option>
                ))}
            </select>
            <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
        </div>
    );
};

export default IngredientSelect;

import { useState, useEffect } from 'react';

const useFetchIngredients = (fetchOriginPath) => {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        const fetchIngredients = async () => {
            const API_ROOT = '/jsonapi/';
            const url = `${API_ROOT}${fetchOriginPath}`;

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

    return ingredients;
}

export default useFetchIngredients;
import { useState, useEffect } from 'react';

const useFetchRecipes = (fetchOriginPath) => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const API_ROOT = '/jsonapi/';
            const url = `${API_ROOT}${fetchOriginPath}`;
            console.log(url)
            const headers = new Headers({ Accept: 'application/vnd.api+json' });

            try {
                const response = await fetch(url, { headers });
                const data = await response.json();
                console.log(data.data)
                if (data.data) {
                    const item = data.data;
                    const recipeData = {
                        nid: item.attributes.drupal_internal__nid,
                        title: item.attributes.title,
                        url: item.attributes.body.value,
                        ingredientsIds: item.relationships.field_ingredients.data.map(ingredient => ingredient.id),
                        recipeImageId: item.relationships.field_image.data.id,
                    };
                    setRecipes(recipeData);
                }
            } catch (error) {
                console.log('There was an error accessing the API', error);
            }
        };

        fetchRecipes();
    }, []);
    
    return recipes;
};

export default useFetchRecipes;
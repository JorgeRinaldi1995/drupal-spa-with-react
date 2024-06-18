import { useState, useEffect } from 'react';

function isValidData(data) {
    return data !== null && data.data !== undefined && data.data.length !== 0;
}

const useFetchRecipes = (fetchOriginPath) => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const API_ROOT = '/jsonapi/';
            const url = `${API_ROOT}${fetchOriginPath}`;

            const headers = new Headers({ Accept: 'application/vnd.api+json' });

            try {
                const response = await fetch(url, { headers });
                const data = await response.json();
                if (isValidData(data)) {
                    setRecipes(data.data);
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
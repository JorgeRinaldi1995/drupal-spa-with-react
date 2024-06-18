import { useState, useEffect } from 'react';

const useFetchImages = (fetchOriginPath) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const API_ROOT = '/jsonapi/';
            const url = `${API_ROOT}${fetchOriginPath}`;

            const headers = new Headers({ Accept: 'application/vnd.api+json' });

            try {
                const response = await fetch(url, { headers });
                const data = await response.json();

                if (data.included) {
                    const recipeImageData = data.included.map(item => ({
                        id: item.id,
                        filename: item.attributes.filename,
                        url: item.attributes.uri.url,
                        value: item.attributes.uri.value
                    }));
                    setImages(recipeImageData);
                    
                }
            } catch (error) {
                console.log('There was an error accessing the API', error);
            }
        };

        fetchImages();
    }, []);

    return images;
};

export default useFetchImages;
import React, { useState } from "react";
import { fetchWithCSRFToken } from "../../utils/fetch";
import IngredientSelect from "./IngredientsSelect";
import SelectedIngredientDisplay from "./SelectedIngredientDisplay";
import ImageUploader from "./ImageUploader";
import './style.scss'

const RecipeForm = ({ id, title, body, ingredients, onSuccess }) => {
    const [isSubmitting, setSubmitting] = useState(false);
    const [result, setResult] = useState({
        success: null,
        error: null,
        message: '',
    });

    const initialRecipeValues = {
        title: title || '',
        body: body || '',
        selectedIngredients: []
    };

    const [image, setImage] = useState(null); // State for the image file
    const [base64Image, setBase64Image] = useState(null); // State for the base64 image

    const [values, setValues] = useState(initialRecipeValues);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleIngredientAdd = (ingredient) => {
        if (ingredient) {
            setValues(prevValues => {
                const isDuplicate = prevValues.selectedIngredients.some(i => i.id === ingredient.id);
                if (!isDuplicate) {
                    return {
                        ...prevValues,
                        selectedIngredients: [...prevValues.selectedIngredients, ingredient]
                    };
                }
                return prevValues;
            });
        }
    };
    /* const [image, setImage] = useState(null); */

/*     const handleImageUpload = async (event) => {
        const selectedImage = event.target.files[0];
        console.log('image que eu subi', selectedImage);
        setImage(selectedImage);

        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onloadend = async () => {
            const base64Image = reader.result;
            console.log('cripto 64', base64Image)
            const csrfUrl = `session/token?format=json`;
            const fetchUrl = id ? ` /jsonapi/node/recipe/${id}/field_image` : `/jsonapi/node/recipe/field_image`;


            const fetchOptions = {
                method: id ? 'PATCH' : 'POST',
                credentials: 'same-origin',
                headers: new Headers({
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    'Cache': 'no-cache',
                    'Content-Disposition': `File; filename="${selectedImage.name}"`,
                }),
                body: {
                    "data": {
                        "type": "file--file",
                        "filename": `${selectedImage.name}`,
                        "attributes": {
                            "uri": {
                                "value": `public://2024-06/${selectedImage.name}`,
                                "uri": `/sites/default/files/2024-06/${selectedImage.name}`
                            },
                            "filemime": `${base64Image}`,
                        }
                    }
                }
            };
            console.log(fetchOptions);
            
            const response = await fetchWithCSRFToken(csrfUrl, fetchUrl, fetchOptions);
            console.log('respsota', response.json(), response);
            if (!response.ok) {
                throw new Error('Failed to upload file');
            }
            console.log(response)
            return response.json();

        }
    }; */

    const handleImageUpload = (file, base64Image) => {
        console.log('on handle upload', file, base64Image)
        setImage(file);
        setBase64Image(base64Image);
    };

    const handleSubmit = async (event) => {
        setSubmitting(true);
        event.preventDefault();


        const csrfUrl = `session/token?format=json`;
        const fetchUrl = id ? `jsonapi/node/recipe/${id}` : `jsonapi/node/recipe`;

        let recipe = {
            "data": {
                "type": "node--recipe",
                "attributes": {
                    "title": `${values.title}`,
                    "body": {
                        "value": `${values.body}`,
                        "format": 'basic_html',
                    },
                },
                "relationships": {
                    "field_ingredients": {
                        "data": values.selectedIngredients.map(ingredient => ({
                            "type": "taxonomy_term--ingredients",
                            "id": ingredient.id,
                            "meta": {
                                "drupal_internal__target_id": ingredient.internal_tid
                            }
                        }))
                    },

                }
            }
        };

        console.log(recipe)
        if (id) {
            recipe.data.id = id;
        }

        const fetchOptions = {
            method: id ? 'PATCH' : 'POST',
            credentials: 'same-origin',
            headers: new Headers({
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Cache': 'no-cache',
            }),
            body: JSON.stringify(recipe),
        };

        try {
            console.log('entrei aquyi')
            const response = await fetchWithCSRFToken(csrfUrl, fetchUrl, fetchOptions);
            const recipeData = await response.json();
            console.log('recipe data', recipeData)

            if (!response.ok || (recipeData.errors && recipeData.errors.length > 0)) {
                throw new Error(recipeData.errors ? `${recipeData.errors[0].title}: ${recipeData.errors[0].detail}` : 'Failed to fetch response');
            }

            setValues(initialRecipeValues);

            if (image && base64Image) {
                await uploadImageToRecipe(recipeData.data.id, image, base64Image, csrfUrl);
            }

            setResult({
                success: true,
                message: (
                    <div className="messages messages--status">
                        {(id ? 'Updated' : 'Added')}: <em>{recipeData.data.attributes.title}</em>
                    </div>
                ),
            });

            if (typeof onSuccess === 'function') {
                onSuccess(recipeData.data);
            }
        } catch (error) {
            console.error('Error while contacting API', error);
            setResult({
                success: false,
                error: true,
                message: (
                    <div className="messages messages--error">
                        Error: {error.message}
                    </div>
                ),
            });
        } finally {
            setSubmitting(false);
        }
/*         fetchWithCSRFToken(csrfUrl, fetchUrl, fetchOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch response');
                }
                return response.json();
            })
            .then((recipe) => {
                setSubmitting(false);

                if (recipe.errors && recipe.errors.length > 0) {
                    setResult({
                        success: false,
                        error: true,
                        message: (
                            <div className="messages messages--error">
                                {recipe.errors[0].title}: {recipe.errors[0].detail}
                            </div>
                        ),
                    });
                    return;
                }

                setValues(initialRecipeValues);

                if (recipe.data.id) {
                    setResult({
                        success: true,
                        message: (
                            <div className="messages messages--status">
                                {(id ? 'Updated' : 'Added')}: <em>{recipe.data.attributes.title}</em>
                            </div>
                        ),
                    });

                    if (typeof onSuccess === 'function') {
                        onSuccess(recipe.data);
                    }
                }
            })
            .catch((error) => {
                console.error('Error while contacting API', error);
                setSubmitting(false);
            }); */
    };

    const uploadImageToRecipe = async (recipeId, file, base64Image, csrfUrl) => {
        console.log('upload image to recipe', recipeId, file, base64Image, csrfUrl)
        const fetchUrl = `jsonapi/node/recipe/${recipeId}/field_image`;
        const fetchOptions = {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `file; filename="${file.name}"`,
            }),
            body: base64Image,
        };

        const response = await fetchWithCSRFToken(csrfUrl, fetchUrl, fetchOptions);
        if (!response.ok) {
            throw new Error('Failed to upload file');
        }
    };

    if (isSubmitting) {
        return (
            <div>
                Processing ...
            </div>
        );
    }

    return (
        <div>
            {(result.success || result.error) && (
                <div>
                    <h2>{result.success ? 'Success!' : 'Error'}:</h2>
                    {result.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="form">
                <input
                    name="title"
                    type="text"
                    value={values.title}
                    placeholder="Title"
                    onChange={handleInputChange}
                />
                <br />
                <textarea
                    name="body"
                    rows="4"
                    cols="30"
                    value={values.body}
                    placeholder="Body"
                    onChange={handleInputChange}
                />
                <br />
                <ImageUploader onImageUpload={handleImageUpload}/>
                <IngredientSelect onIngredientAdd={handleIngredientAdd} />
                <br />
                <SelectedIngredientDisplay ingredients={values.selectedIngredients} />
                <input
                    name="submit"
                    type="submit"
                    value={id ? 'Edit existing node' : 'Create recipe'}
                />
            </form>
        </div>
    );
}

export default RecipeForm;

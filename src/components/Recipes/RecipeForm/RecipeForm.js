import React, { useState } from "react";
import { fetchWithCSRFToken } from "../../../utils/fetch";
import IngredientSelect from "../IngredientsSelect/IngredientsSelect";
import SelectedIngredientDisplay from "../SelectedIngredientDisplay/SelectedIngredientDisplay";
import ImageUploader from "../ImageUploader/ImageUploader";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './style.scss';


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
    const [buffer, setBuffer] = useState(null); // State for the base64 image

    const [values, setValues] = useState(initialRecipeValues);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleBodyChange = (event, editor) => {
        const data = editor.getData();
        setValues({ ...values, body: data });
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

    const handleImageUpload = (file, buffer) => {
        setImage(file);
        setBuffer(buffer);
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
            
            const response = await fetchWithCSRFToken(csrfUrl, fetchUrl, fetchOptions);
            const recipeData = await response.json();
            

            if (!response.ok || (recipeData.errors && recipeData.errors.length > 0)) {
                throw new Error(recipeData.errors ? `${recipeData.errors[0].title}: ${recipeData.errors[0].detail}` : 'Failed to fetch response');
            }

            setValues(initialRecipeValues);

            if (image && buffer) {
                await uploadImageToRecipe(recipeData.data.id, image, buffer, csrfUrl);
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

    };

    const uploadImageToRecipe = async (recipeId, file, buffer, csrfUrl) => {
        
        const fetchUrl = `jsonapi/node/recipe/${recipeId}/field_image`;
        const fetchOptions = {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `file; filename="${file.name}"`,
            }),
            body: buffer,
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
                <CKEditor
                    editor={ ClassicEditor }
                    data={values.body}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={handleBodyChange}
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

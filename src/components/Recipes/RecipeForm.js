import React, { useState } from "react";
import { fetchWithCSRFToken } from "../../utils/fetch";
import IngredientSelect from "./IngredientsSelect";

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

    const [values, setValues] = useState(initialRecipeValues);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleIngredientChange = (ingredient) => {
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

    const handleSubmit = (event) => {
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
                    }
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
                'Cache': 'no-cache'
            }),
            body: JSON.stringify(recipe),
        };

        fetchWithCSRFToken(csrfUrl, fetchUrl, fetchOptions)
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
            });
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
            <form onSubmit={handleSubmit}>
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
                <IngredientSelect onIngredientChange={handleIngredientChange} />
                <input
                    name="submit"
                    type="submit"
                    value={id ? 'Edit existing node' : 'Add new node'}
                />
            </form>
        </div>
    );
}

export default RecipeForm;

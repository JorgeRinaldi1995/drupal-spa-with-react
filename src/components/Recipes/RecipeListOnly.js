import React, { useEffect, useState } from "react";
import RecipeForm from "./RecipeForm";

function isValidData(data) {
  if (data === null) {
    return false;
  }
  if (data.data === undefined ||
    data.data === null ||
    data.data.length === 0 ) {
    return false;
  }
  return true;
}

const RecipeItem = ({drupal_internal__nid, title}) => (
  <div>
    <a href={`/node/${drupal_internal__nid}`}>{title}</a>
  </div>
);

const NoData = () => (
  <div>No recipes found.</div>
);

const RecipeListOnly = () => {
  const [content, setContent] = useState(false);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    // This should point to your local Drupal instance. Alternatively, for React
    // applications embedded in a Drupal theme or module this could also be set
    // to a relative path.
    const API_ROOT = '/jsonapi/';
    const url = `${API_ROOT}node/recipe?fields[node--recipe]=id,drupal_internal__nid,title,body,field_ingredients&sort=-created&page[limit]=10`;

    const headers = new Headers({
      Accept: 'application/vnd.api+json',
    });

    fetch(url, {headers})
      .then((response) => response.json())
      .then((data) => {
        if (isValidData(data)) {
          setContent(data.data)
        }
      })
      .catch(err => console.log('There was an error accessing the API', err));
  }, []);
  console.log(content)
  return (
    <div>
      <h2>Site content</h2>
      <RecipeForm />
      {content ? (
        <>
          <label htmlFor="filter">Type to filter:</label>
          <input
            type="text"
            name="filter"
            placeholder="Start typing ..."
            onChange={(event => setFilter(event.target.value.toLowerCase()))}
          />
          <hr/>
          {
            content.filter((item) => {
              if (!filter) {
                return item;
              }

              if (filter && (item.attributes.title.toLowerCase().includes(filter) || item.attributes.field_ingredients.toLowerCase().includes(filter) || item.attributes.body.value.toLowerCase().includes(filter))) {
                return item;
              }
            }).map((item) => <RecipeItem key={item.id} {...item.attributes}/>)
          }
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default RecipeListOnly;
import React from 'react'
import ReactDOM from 'react-dom/client'

/* Import Components */
import DrupalProjectStats from './components/BaseCrud/DrupalProjectStats';
import NodeListOnly from "./components/BaseCrud/NodeListOnly";
import NodeReadWrite from "./components/BaseCrud/NodeReadWrite";
import RecipeListOnly from './components/Recipes/RecipeListOnly';
import RecipeForm from './components/Recipes/RecipeForm';


// Define Main as a functional component
const Main = () => (
  <>
    {
      // <DrupalProjectStats projectName="drupal" />
    }
    {
      // <NodeListOnly />
    }
    {
      <RecipeListOnly />
    }
  </>
);

// Get the container for your app
const container = document.getElementById('react-app');

// Check if the container exists to avoid null errors
if (container) {
  // Create a root
  const root = ReactDOM.createRoot(container);

  // Render the Main component
  root.render(<Main />);
} else {
  console.error('Failed to find the root element');
}
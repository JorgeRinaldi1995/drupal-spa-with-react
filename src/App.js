import React from 'react';
import RecipeForm from './components/Recipes/RecipeForm/RecipeForm';
import RecipeList from './components/Recipes/RecipeList/RecipeList';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RecipeForm />} />
                <Route path="/recipes" element={<RecipeList />} />
                <Route path="/recipe/:nid" />
            </Routes>
        </Router>

    )
}

export default App;
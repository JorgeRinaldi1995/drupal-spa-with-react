import React from 'react';
import RecipeForm from './components/Recipes/RecipeForm';
import RecipeListOnly from './components/Recipes/RecipeListOnly';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RecipeForm />} />
                <Route path="/recipes" element={<RecipeListOnly />} />
                <Route path="/recipe/:nid" />
            </Routes>
        </Router>

    )
}

export default App;
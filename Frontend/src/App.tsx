import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import './App.css';
import Login from './AuthPages/Login/Login';
import Register from './AuthPages/Register/Register';
import Homepage from './Homepage/Homepage';
import ProtectedRoute from './Defaults/ProtectedRoute/ProtectedRoute';
import RecipePage from './Homepage/RecipePage/RecipePage';
import RecipeEditor from './Homepage/RecipePage/RecipeEditor/RecipeEditor';

export const basename = '/cooking-recipe-suggester/#';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={
                    <ProtectedRoute><Homepage /></ProtectedRoute>}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/recipe/create' element={<ProtectedRoute><RecipeEditor /></ProtectedRoute>}></Route>
                <Route path='/recipe/import/:url' element={<ProtectedRoute><RecipeImportWrapper /></ProtectedRoute>}></Route>
                <Route path='/recipe/:id' element={<ProtectedRoute><RecipePageWrapper /></ProtectedRoute>}></Route>
                <Route path='/recipe/:id/editor' element={<ProtectedRoute><RecipeEditorWrapper /></ProtectedRoute>}></Route>
            </Routes>
        </Router>
    );
}

function RecipePageWrapper() {
    const { id } = useParams();
    if(!id) return null;
    return <RecipePage recipeId={id} />;
}

function RecipeEditorWrapper() {
    const { id } = useParams();
    if(!id) return null;
    return <RecipeEditor recipeId={id} />;
}

function RecipeImportWrapper() {
    const { url } = useParams();
    if(!url) return null;
    return <RecipeEditor sourceUrl={decodeURIComponent(url)} />;
}

export default App;

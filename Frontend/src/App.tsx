import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './AuthPages/Login/Login';
import Register from './AuthPages/Register/Register';
import Homepage from './Homepage/Homepage';
import ProtectedRoute from './Defaults/ProtectedRoute/ProtectedRoute';

export const basename = '/cooking-recipe-suggester';

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute><Homepage /></ProtectedRoute>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './AuthPages/Login/Login';
import Register from './AuthPages/Register/Register';

function App() {
  return (
    <Router basename='/cooking-recipe-suggester'>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

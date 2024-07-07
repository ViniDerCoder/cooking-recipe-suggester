import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './AuthPages/Login/Login';

const defaultPath = '/cooking-recipe-suggester/';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={defaultPath} element={<Login />}></Route>
        <Route path={defaultPath + 'login'} element={<Login />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

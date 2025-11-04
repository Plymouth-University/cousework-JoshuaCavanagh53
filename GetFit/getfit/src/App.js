import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login.js';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< LoginPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

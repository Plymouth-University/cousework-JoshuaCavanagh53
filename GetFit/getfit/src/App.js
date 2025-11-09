import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login.js';
import MainPage from './main.js';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< LoginPage/>} />
        <Route path="/home" element={<MainPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

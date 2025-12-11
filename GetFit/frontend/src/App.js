import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Login.js';
import Overview from './pages/Overview.js';
import Progress from './pages/Progress.js';
import Account from './pages/Account.js';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< LoginPage/>} />
        <Route path="/overview" element={<Overview/>} />
        <Route path="/progress" element={<Progress/>} />
        <Route path="/account" element={<Account/>} />

      </Routes>
    </Router>
  );
}

export default App;

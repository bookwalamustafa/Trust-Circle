import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import GroupPage from './pages/GroupPage';
import LoginSignup from './pages/LoginSignup';
import CreateGroupPage from './pages/CreateGroupPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/group" element={<GroupPage />} />
        <Route path="/login" element={<LoginSignup mode="login" />} />
        <Route path="/signup" element={<LoginSignup mode="signup" />} />
        <Route path="/creategroup" element={<CreateGroupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
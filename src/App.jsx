import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AutomatoPage from './pages/AutomatoPage';
import BeePage from './pages/BeePage';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games/automato" element={<AutomatoPage />} />
      <Route path="/games/bee" element={<BeePage />} />
    </Routes>
  );
}

export default App;




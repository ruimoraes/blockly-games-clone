import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MazePage from './pages/MazePage';
import BeePage from './pages/BeePage';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games/maze" element={<MazePage />} />
      <Route path="/games/bee" element={<BeePage />} />
      <Route path="/maze" element={<MazePage />} />
      <Route path="/bee" element={<BeePage />} />
    </Routes>
  );
}

export default App;




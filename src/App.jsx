import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MazePage from './pages/MazePage';
import PuzzlePage from './pages/PuzzlePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games/maze" element={<MazePage />} />
      <Route path="/games/puzzle" element={<PuzzlePage />} />
    </Routes>
  );
}

export default App;


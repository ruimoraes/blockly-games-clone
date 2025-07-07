import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AutomatoPage from './pages/AutomatoPage';
import MazePage from './pages/MazePage';
import './App.css';

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<AutomatoPage />} /> */}
      <Route path="/" element={<MazePage />} />
    </Routes>
  );
}

export default App;




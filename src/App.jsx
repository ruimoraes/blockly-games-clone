import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AutomatoPage from './pages/AutomatoPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AutomatoPage />} />
    </Routes>
  );
}

export default App;


// src/App.js
import React from 'react';
import './styles/App.css';
import './styles/Global.css';
import StockSimulator from './components/StockSimulator';

function App() {
  return (
    <div className="App">
      <StockSimulator />
    </div>
  );
}

export default App;
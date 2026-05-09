// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navbar.js';
import Home from './components/Home';
import Prediccion from './components/Prediccion';
import Equipos from './components/Equipos';
import EquipoDetalle from './components/EquipoDetalle';
import SimuladorIA from './components/SimuladorIA';

function App() {
  return (
    <Router>
      <div className="bg-[#0e0e0e] min-h-screen text-white">
        {/* Aquí va la navegación fija */}
        <Navigation />
        {/* Aquí se cargan los módulos dinámicamente */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prediccion" element={<Prediccion />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/equipos/:id" element={<EquipoDetalle />} />
          <Route path='/simulacion' element={<SimuladorIA />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
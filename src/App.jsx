import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // <-- 1. IMPORTA ESTO

import Header from "./components/Header";
import Home from "./views/Home";
import Login from "./views/Login";
import DetalleProducto from "./views/DetalleProducto";

function App() {
  const [busqueda, setBusqueda] = React.useState("");
  const [cantidad, setCantidad] = React.useState(0);

  return (
    <Router>
      {/* 2. COLOCA EL CONTENEDOR DE TOASTS AQUÍ */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Header cantidad={cantidad} busqueda={busqueda} setBusqueda={setBusqueda} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home setCantidad={setCantidad} busqueda={busqueda} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
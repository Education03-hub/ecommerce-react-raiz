import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Footer from "./components/Footer"; // 1. Importamos el Footer
import Home from "./views/Home";
import Login from "./views/Login";
import DetalleProducto from "./views/DetalleProducto";

function App() {
  const [busqueda, setBusqueda] = useState("");
  const [cantidad, setCantidad] = useState(0);

  return (
    <Router>
      {/* Contenedor principal con Flexbox para empujar el Footer al fondo */}
      <div className="flex flex-col min-h-screen">
        
        {/* Contenedor global de notificaciones */}
        <Toaster position="top-center" reverseOrder={false} />
        
        <Header cantidad={cantidad} busqueda={busqueda} setBusqueda={setBusqueda} />
        
        {/* El 'flex-grow' hace que la vista tome todo el espacio disponible */}
        <main className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home setCantidad={setCantidad} busqueda={busqueda} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
          </Routes>
        </main>

        {/* 2. Añadimos el Footer al final */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;
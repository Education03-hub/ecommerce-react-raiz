import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// IMPORTAMOS TUS ASSETS
import likeIcon from "../assets/like.png";
import carroIcon from "../assets/carro.png";
import buscarIcon from "../assets/buscar.png";

const Header = ({ cantidad = 0, busqueda = "", setBusqueda }) => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const cerrarMenu = () => {
    setBusqueda("");
    setMenuAbierto(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex flex-col" onClick={cerrarMenu}>
          <h1 className="text-xl md:text-2xl font-bold text-blue-600">
            Servicio Técnico PC
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">
            Reparación y mantenimiento profesional
          </p>
        </Link>

        {/* Menú de Navegación (Desktop) */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors" onClick={() => setBusqueda("")}>
            Inicio
          </Link>
          <Link to="/" className="hover:text-blue-600 transition-colors" onClick={() => setBusqueda("")}>
            Servicios
          </Link>
          <Link to="/login" className="hover:text-blue-600 transition-colors">
            Registro
          </Link>
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Contacto
          </Link>
        </nav>

        {/* Buscador y Acciones */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* BUSCADOR (Desktop/Tablet) */}
          <form onSubmit={manejarBusqueda} className="relative hidden lg:flex items-center">
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform focus:outline-none"
              aria-label="Buscar"
            >
              <img 
                src={buscarIcon} 
                alt="Buscar" 
                className="w-5 h-5 object-contain block"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </button>
          </form>

          {/* Favoritos */}
          <div className="relative cursor-pointer">
            <img
              src={likeIcon}
              alt="Favoritos"
              className="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          {/* Carrito de Compras */}
          <div className="relative cursor-pointer">
            <img
              src={carroIcon}
              alt="Carrito"
              className="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cantidad}
            </span>
          </div>

          {/* Botón Hamburguesa (Móvil) */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-gray-700 focus:outline-none p-1"
            aria-label="Abrir menú"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Menú Desplegable (Móvil) */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-lg">
          {/* Buscador móvil opcional */}
          <form onSubmit={(e) => { manejarBusqueda(e); setMenuAbierto(false); }} className="relative flex items-center mb-4">
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
            />
            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <img src={buscarIcon} alt="Buscar" className="w-5 h-5 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            </button>
          </form>

          <Link to="/" className="block text-gray-700 font-medium py-1 hover:text-blue-600" onClick={cerrarMenu}>
            Inicio
          </Link>
          <Link to="/" className="block text-gray-700 font-medium py-1 hover:text-blue-600" onClick={cerrarMenu}>
            Servicios
          </Link>
          <Link to="/login" className="block text-gray-700 font-medium py-1 hover:text-blue-600" onClick={cerrarMenu}>
            Registro
          </Link>
          <Link to="/" className="block text-gray-700 font-medium py-1 hover:text-blue-600" onClick={cerrarMenu}>
            Contacto
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
import React from "react";
import { Link, useNavigate } from "react-router-dom";

// IMPORTAMOS TUS ASSETS
import likeIcon from "../assets/like.png";
import carroIcon from "../assets/carro.png";
import buscarIcon from "../assets/buscar.png"; // Tu asset de la lupa

const Header = ({ cantidad = 0, busqueda = "", setBusqueda }) => {
  const navigate = useNavigate();

  // Función para manejar la acción de buscar al dar Enter o clic en el botón
  const manejarBusqueda = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // Si el usuario no está en la página de inicio, lo redirigimos al catálogo
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex flex-col" onClick={() => setBusqueda("")}>
          <h1 className="text-2xl font-bold text-blue-600">
            Servicio Técnico PC
          </h1>
          <p className="text-xs text-gray-500">
            Reparación y mantenimiento profesional
          </p>
        </Link>

        {/* Menú de Navegación */}
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
        <div className="flex items-center gap-4">
          
          {/* FORMULARIO DE BÚSQUEDA */}
          <form onSubmit={manejarBusqueda} className="relative hidden lg:flex items-center">
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 transition-all"
            />
            {/* Botón interactivo interno */}
            <button 
              type="submit" 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform focus:outline-none"
              aria-label="Buscar"
            >
              <img 
                src={buscarIcon} 
                alt="Buscar" 
                className="w-5 h-5 object-contain block"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </button>
          </form>

          {/* Favoritos */}
          <div className="relative cursor-pointer">
            <img
              src={likeIcon}
              alt="Favoritos"
              className="w-8 h-8 hover:scale-110 transition-transform"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Carrito de Compras */}
          <div className="relative cursor-pointer">
            <img
              src={carroIcon}
              alt="Carrito"
              className="w-8 h-8 hover:scale-110 transition-transform"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cantidad}
            </span>
          </div>

          {/* HEMOS ELIMINADO EL ICONO DEL VASO/LUPA EXTRA AQUÍ */}
        </div>

      </div>
    </header>
  );
};

export default Header;
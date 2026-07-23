import React from "react";
import { Link } from "react-router-dom"; 
const Footer = () => {
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 w-full">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Contenido principal */}
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">

          {/* Información */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">
              Servicio Técnico PC
            </h3>
            <p className="text-sm text-gray-400">
              Especialistas en mantenimiento, reparación y optimización de
              computadoras y laptops.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Registro / Boletín
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">
              Contacto
            </h3>
            <p className="text-sm">📞 +51 999 999 999</p>
            <p className="text-sm">📧 soporte@serviciopc.com</p>
            <p className="text-sm">📍 Oxapampa, Perú</p>
          </div>

        </div>

        {/* Línea inferior */}
        <div className="border-t border-gray-700 mt-8 pt-5 text-center text-sm text-gray-500">
          <p>
            © {anio} Servicio Técnico PC. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
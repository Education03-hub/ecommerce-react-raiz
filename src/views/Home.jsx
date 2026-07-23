import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importamos Link para la navegación al detalle

// 1. Recibimos 'busqueda' como una prop desde App.jsx
const Home = ({ setCantidad, busqueda = "" }) => {
  const [misProductos, setMisProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const URL_API = "https://firestore.googleapis.com/v1/projects/registrodetrabajos-b6dde/databases/(default)/documents/productos";

  useEffect(() => {
    fetch(URL_API)
      .then((response) => response.json())
      .then((data) => {
        if (data.documents) {
          const datosLimpios = data.documents.map((doc) => {
            const campos = doc.fields;
            // Obtenemos el ID del documento como última opción segura
            const idDocumento = doc.name.split("/").pop();

            return {
              // Mapeamos de forma segura los valores de Firestore
              id: campos.id?.integerValue || campos.id?.doubleValue || idDocumento,
              nombre: campos.nombre?.stringValue || "Producto sin nombre",
              descripcion: campos.descripcion?.stringValue || "Sin descripción disponible.",
              precio: parseFloat(campos.precio?.doubleValue || campos.precio?.integerValue || "0"),
              precioAnterior: parseFloat(
                campos.precioAnterior?.doubleValue || 
                campos.precioAnterior?.integerValue || 
                campos.precioAntiguo?.doubleValue || 
                campos.precioAntiguo?.integerValue || "0"
              ),
              descuento: campos.descuento?.stringValue || "",
              imagen: campos.imagen?.stringValue || "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600",
            };
          });
          setMisProductos(datosLimpios);
        }
        setCargando(false)
      })
      .catch((error) => {
        console.error("Error al traer los datos de Firebase:", error);
        setCargando(false);
      });
  }, []);

  const agregarAlCarrito = () => {
    setCantidad((prev) => prev + 1);
  };

  // 2. Filtro ultra-reactivo y seguro de productos (limpia espacios en blanco con .trim())
  const productosFiltrados = misProductos.filter((prod) => {
    const nombreProducto = prod.nombre ? prod.nombre.toLowerCase() : "";
    const textoBusqueda = (busqueda || "").toLowerCase().trim();
    return nombreProducto.includes(textoBusqueda);
  });

  if (cargando) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 animate-pulse text-lg">Cargando catálogo desde Firebase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* GRILLA DE PRODUCTOS / SERVICIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <div key={prod.id} className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
              
              {/* Etiqueta de Descuento */}
              {prod.descuento && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  {prod.descuento}
                </span>
              )}

              <img 
                src={prod.imagen} 
                alt={prod.nombre} 
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-800">{prod.nombre}</h3>
                <p className="text-sm text-gray-600 my-2 line-clamp-2">{prod.descripcion}</p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-extrabold text-blue-600">S/. {prod.precio.toFixed(2)}</span>
                  {prod.precioAnterior > 0 && (
                    <span className="text-sm text-gray-400 line-through">S/. {prod.precioAnterior.toFixed(2)}</span>
                  )}
                </div>

                {/* Enlace dinámico para ir al detalle */}
                <Link
                  to={`/producto/${prod.id}`}
                  className="block text-center w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm mb-2"
                >
                  Ver Detalles
                </Link>

                <button
                  onClick={agregarAlCarrito}
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Contratar Servicio
                </button>
              </div>

            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 py-6">
            No se encontraron servicios que coincidan con tu búsqueda.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
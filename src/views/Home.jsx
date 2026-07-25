import React, { useState, useEffect } from "react";
import Card from "../components/Card"; // 1. Importamos tu componente Card

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
            const idDocumento = doc.name.split("/").pop();

            return {
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
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al traer los datos de Firebase:", error);
        setCargando(false);
      });
  }, []);

  const agregarAlCarrito = () => {
    setCantidad((prev) => prev + 1);
  };

  const productosFiltrados = misProductos.filter((prod) => {
    const nombreProducto = prod.nombre ? prod.nombre.toLowerCase() : "";
    const textoBusqueda = (busqueda || "").toLowerCase().trim();
    return nombreProducto.includes(textoBusqueda);
  });

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-gray-500 text-sm font-semibold">Cargando catálogo desde Firebase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <div key={prod.id} className="flex flex-col justify-between">
              {/* 2. Reutilizamos tu componente Card pasándole las props correctas */}
              <Card
                nombre={prod.nombre}
                descripcion={prod.descripcion}
                precio={prod.precio}
                precioAnterior={prod.precioAnterior > 0 ? prod.precioAnterior : null}
                descuento={prod.descuento}
                imagen={prod.imagen}
                alAgregar={agregarAlCarrito}
              />
              
              {/* 3. Botón adicional para ir al detalle (ya que Card no lo traía por defecto) */}
              <a
                href={`/producto/${prod.id}`}
                className="mt-2 block text-center w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-xl hover:bg-gray-300 transition-colors text-sm"
              >
                Ver Detalles
              </a>
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

Home.defaultProps = {
  busqueda: "",
};

export default Home;
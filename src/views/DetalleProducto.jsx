import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // URL base de la API REST de Firestore
  const URL_FIRESTORE = "https://firestore.googleapis.com/v1/projects/registrodetrabajos-b6dde/databases/(default)/documents/productos";

  useEffect(() => {
    const obtenerDatos = async () => {
      setCargando(true);
      setError("");

      try {
        // 1. Petición del producto actual
        const respuestaProducto = await fetch(`${URL_FIRESTORE}/${id}`);
        
        if (!respuestaProducto.ok) {
          throw new Error("No se pudo obtener la información del producto.");
        }

        const datosProducto = await respuestaProducto.json();
        
        const productoFormateado = {
          id: id,
          nombre: datosProducto.fields.nombre?.stringValue || "Producto sin nombre",
          descripcion: datosProducto.fields.descripcion?.stringValue || "Sin descripción disponible.",
          precio: datosProducto.fields.precio?.doubleValue || datosProducto.fields.precio?.integerValue || 0,
          imagen: datosProducto.fields.imagen?.stringValue || "https://via.placeholder.com/400",
          stock: datosProducto.fields.stock?.integerValue || 0
        };

        setProducto(productoFormateado);

        // 2. Petición para obtener otros productos (relacionados)
        const respuestaLista = await fetch(URL_FIRESTORE);
        const datosLista = await respuestaLista.json();

        if (datosLista.documents) {
          const listaLimpia = datosLista.documents.map((doc) => {
            const campos = doc.fields;
            const idDoc = doc.name.split("/").pop();
            return {
              id: idDoc,
              nombre: campos.nombre?.stringValue || "Sin nombre",
              precio: parseFloat(campos.precio?.doubleValue || campos.precio?.integerValue || "0"),
              imagen: campos.imagen?.stringValue || "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600",
            };
          });

          // Filtramos para excluir el producto actual y seleccionamos algunos aleatorios o los primeros 3
          const filtrados = listaLimpia.filter((p) => p.id !== id).slice(0, 3);
          setRelacionados(filtrados);
        }

      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      obtenerDatos();
    }
  }, [id]);

  const agregarAlCarrito = () => {
    toast.success(`¡${producto.nombre} añadido al carrito! 🛒`);
  };

  // 1. ESTADO DE CARGA
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
        <p className="text-gray-500 text-sm font-semibold">Cargando detalles del servicio...</p>
      </div>
    );
  }

  // 2. ESTADO DE ERROR
  if (error || !producto) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-bold text-red-600 mb-2">¡Ups! Algo salió mal</h3>
        <p className="text-gray-500 text-sm mb-4">{error || "El producto no existe."}</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // 3. RENDERIZADO PRINCIPAL CON SECCIÓN DE RELACIONADOS
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-6">
      
      {/* Tarjeta principal del producto */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm font-medium mb-6 transition-colors"
        >
          ← Volver atrás
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="flex justify-center items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="max-h-80 object-contain rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Detalles */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {producto.nombre}
              </h1>
              <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">
                ID de Producto: {producto.id}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {producto.descripcion}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm font-medium">Precio:</span>
                <span className="text-2xl font-bold text-blue-600">
                  S/ {Number(producto.precio).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 text-sm font-medium">Disponibilidad:</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    producto.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {producto.stock > 0 ? `En Stock (${producto.stock} uds)` : "Agotado"}
                </span>
              </div>

              <button
                onClick={agregarAlCarrito}
                disabled={producto.stock === 0}
                className={`w-full py-3 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 ${
                  producto.stock === 0
                    ? "bg-gray-400 cursor-not-allowed opacity-50"
                    : "bg-blue-600 hover:bg-blue-700 shadow-sm"
                }`}
              >
                🛒 Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN NUEVA: SERVICIOS / PRODUCTOS RELACIONADOS */}
      {relacionados.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Otros servicios que te pueden interesar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relacionados.map((rel) => (
              <Link
                key={rel.id}
                to={`/producto/${rel.id}`}
                className="border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <img
                    src={rel.imagen}
                    alt={rel.nombre}
                    className="w-full h-32 object-contain rounded-lg mb-2 group-hover:scale-105 transition-transform"
                  />
                  <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
                    {rel.nombre}
                  </h4>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-blue-600 text-sm">
                    S/ {Number(rel.precio).toFixed(2)}
                  </span>
                  <span className="text-xs text-blue-600 font-medium group-hover:underline">
                    Ver más →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DetalleProducto;
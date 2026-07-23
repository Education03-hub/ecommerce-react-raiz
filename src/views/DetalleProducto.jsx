import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const DetalleProducto = () => {
  // 1. Obtenemos el ID dinámico del producto desde la URL (ej: /producto/123)
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para controlar los datos, la carga y posibles errores
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerDetalle = async () => {
      setCargando(true);
      setError("");

      // URL oficial apuntando al ID específico del documento en tu Firebase
      const urlApi = `https://firestore.googleapis.com/v1/projects/registrodetrabajos-b6dde/databases/(default)/documents/productos/${id}`;

      try {
        const respuesta = await fetch(urlApi);
        
        if (!respuesta.ok) {
          throw new Error("No se pudo obtener la información del producto.");
        }

        const datos = await respuesta.json();
        
        // Mapeamos los datos limpios que vienen del formato estricto de Firestore
        const productoFormateado = {
          id: id,
          nombre: datos.fields.nombre?.stringValue || "Producto sin nombre",
          descripcion: datos.fields.descripcion?.stringValue || "Sin descripción disponible.",
          precio: datos.fields.precio?.doubleValue || datos.fields.precio?.integerValue || 0,
          imagen: datos.fields.imagen?.stringValue || "https://via.placeholder.com/400",
          stock: datos.fields.stock?.integerValue || 0
        };

        setProducto(productoFormateado);
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      obtenerDetalle();
    }
  }, [id]);

  // Acción simulada de añadir al carrito de compras
  const agregarAlCarrito = () => {
    toast.success(`¡${producto.nombre} añadido al carrito! 🛒`);
  };

  // 1. ESTADO DE CARGA (SPINNER)
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <svg
          className="animate-spin h-10 w-10 text-brand-primary"
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
        <p className="text-text-secondary text-sm font-semibold">Cargando detalles del producto...</p>
      </div>
    );
  }

  // 2. ESTADO DE ERROR
  if (error || !producto) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-bold text-error mb-2">¡Ups! Algo salió mal</h3>
        <p className="text-text-secondary text-sm mb-4">{error || "El producto no existe."}</p>
        <Link
          to="/"
          className="inline-block bg-brand-primary text-white text-sm font-semibold px-4 py-2 rounded-radius-md hover:bg-brand-primary-hover transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // 3. RENDERIZADO DEL DETALLE (ESTRUCTURA DE UX PROFESIONAL)
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-radius-lg border border-border-default shadow-sm mt-6">
      {/* Botón para volver atrás */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-text-secondary hover:text-brand-primary text-sm font-medium mb-6 transition-colors"
      >
        ← Volver atrás
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lado Izquierdo: Imagen del Producto */}
        <div className="flex justify-center items-center bg-background-light p-4 rounded-radius-lg border border-border-default">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="max-h-80 object-contain rounded-radius-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Lado Derecho: Detalles, Precio y Botón de compra */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-lora font-bold text-brand-primary mb-2">
              {producto.nombre}
            </h1>
            <p className="text-xs text-text-secondary mb-4 uppercase tracking-wider font-semibold">
              ID de Producto: {producto.id}
            </p>
            <p className="text-text-primary text-sm leading-relaxed mb-6">
              {producto.descripcion}
            </p>
          </div>

          <div className="border-t border-border-default pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-text-secondary text-sm font-medium">Precio:</span>
              <span className="text-2xl font-bold text-brand-primary">
                S/ {producto.precio.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-text-secondary text-sm font-medium">Disponibilidad:</span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  producto.stock > 0
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                }`}
              >
                {producto.stock > 0 ? `En Stock (${producto.stock} uds)` : "Agotado"}
              </span>
            </div>

            <button
              onClick={agregarAlCarrito}
              disabled={producto.stock === 0}
              className={`w-full py-2.5 text-white text-sm font-semibold rounded-radius-md transition-all active:scale-95 flex justify-center items-center gap-2 ${
                producto.stock === 0
                  ? "bg-text-secondary cursor-not-allowed opacity-50"
                  : "bg-brand-accent hover:bg-brand-accent-hover shadow-sm"
              }`}
            >
              🛒 Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
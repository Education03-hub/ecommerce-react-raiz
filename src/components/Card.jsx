import React from "react";

const Card = ({
  nombre,
  descripcion,
  precio,
  precioAnterior,
  descuento,
  imagen,
  alAgregar,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      <div className="bg-blue-600 text-white text-xs font-semibold py-2 px-4">
        Servicio Destacado
      </div>

      <div className="p-5 flex justify-center">
        {imagen ? (
          <img
            src={imagen}
            alt={nombre ?? "producto"}
            className="w-full max-w-[220px] h-48 object-contain"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {nombre ?? "Sin nombre"}
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          {descripcion ?? "Sin descripción"}
        </p>

        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {precio != null ? `S/ ${precio}` : "Sin precio"}
          </span>

          {precioAnterior != null && (
            <span className="text-gray-400 line-through">
              S/ {precioAnterior}
            </span>
          )}

          {descuento && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
              {descuento}
            </span>
          )}
        </div>

        <button
          onClick={() => alAgregar?.()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default Card;
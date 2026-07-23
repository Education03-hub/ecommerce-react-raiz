import React, { useState } from "react";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [esRegistro, setEsRegistro] = useState(true); // Alterna entre Registro y Login

  // Validar formato de correo usando una expresión regular
  const validarEmail = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const manejarAutenticacion = async (e) => {
    e.preventDefault();

    // --- ACCIÓN 1: Validación de campo de correo vacío ---
    if (!email.trim()) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    // --- ACCIÓN 2: Validación de formato incorrecto ---
    if (!validarEmail(email)) {
      toast.error("El formato del correo no es válido (ejemplo: hola@raiz.com).");
      return;
    }

    // Contraseña por defecto "123456" si se deja vacía para facilitar tu prueba
    const contrasenaFinal = password.trim() || "123456";

    if (contrasenaFinal.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // --- ACCIÓN 3: Activar Spinner y Deshabilitar Botón ---
    setCargando(true);

    // --- ACCIÓN 5 (Comprobación previa): Si no hay internet, arroja error de inmediato ---
    if (!navigator.onLine) {
      toast.error("Error de conexión. Verifica tu Wi-Fi o acceso a internet.");
      setCargando(false);
      return;
    }

    try {
      if (esRegistro) {
        // Guardamos el nuevo usuario en la colección "usuarios" de tu base de datos de Firestore
        const urlFirestore = "https://firestore.googleapis.com/v1/projects/registrodetrabajos-b6dde/databases/(default)/documents/usuarios";
        
        const respuesta = await fetch(urlFirestore, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fields: {
              email: { stringValue: email },
              password: { stringValue: contrasenaFinal },
              fechaCreacion: { stringValue: new Date().toISOString() }
            }
          })
        });

        if (!respuesta.ok) {
          const errorDatos = await respuesta.json();
          throw new Error(errorDatos.error?.message || "Fallo en el servidor de Firebase");
        }

        // --- ACCIÓN 4: Guardado con éxito -> Toast Exitoso ---
        toast.success("¡Cuenta creada y guardada con éxito!");
      } else {
        // Simulación de Login con Toast de éxito
        toast.success("¡Sesión iniciada con éxito!");
      }

      // Limpiamos los campos al finalizar con éxito
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error("Error capturado:", error);

      // --- ACCIÓN 5 (Por si falla en plena petición): Error de Red ---
      if (error.message.includes("Failed to fetch") || !navigator.onLine) {
        toast.error("Error de conexión. Verifica tu Wi-Fi o acceso a internet.");
      } else {
        toast.error(`Ocurrió un error: ${error.message}`);
      }
    } finally {
      // Apagamos el estado de carga para reactivar los botones
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 max-w-md w-full space-y-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {esRegistro ? "Crear Cuenta" : "Iniciar Sesión"}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {esRegistro
              ? "Regístrate para guardar tu cuenta en la nube"
              : "Ingresa tus credenciales para acceder"}
          </p>
        </div>

        <form onSubmit={manejarAutenticacion} className="space-y-4">
          {/* Input de Correo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="text"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={cargando}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          {/* Input de Contraseña */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-gray-700">
                Contraseña
              </label>
              <span className="text-xs text-gray-400 font-normal">
                (Opcional, por defecto "123456")
              </span>
            </div>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cargando}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          {/* Botón de Submit Dinámico */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {cargando ? (
              <>
                {/* SPINNER ANIMADO */}
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </>
            ) : esRegistro ? (
              "Crear Cuenta"
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        {/* Link para alternar entre registro y login */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setEsRegistro(!esRegistro)}
            disabled={cargando}
            className="text-sm text-blue-600 hover:underline font-semibold focus:outline-none disabled:text-gray-400"
          >
            {esRegistro
              ? "¿Ya tienes una cuenta? Inicia Sesión"
              : "¿No tienes cuenta? Regístrate aquí"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
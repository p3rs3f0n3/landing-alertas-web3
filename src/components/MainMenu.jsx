// MainMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function MainMenu({ account, setLoggedIn, setProvider, setAccount }) {
  const navigate = useNavigate();

  const logout = () => {
    const confirmLogout = window.confirm("¿Estás segura que deseas cerrar sesión?");
    if (confirmLogout) {
      setLoggedIn(false);
      setProvider(null);
      setAccount("");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">🛑 Panel de Alertas de Emergencia</h1>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>

        {!account ? (
          <div className="text-center text-gray-600">
            Wallet no conectada. Por favor reinicia sesión.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Ver Todas las Alertas</h2>
              <p className="text-gray-600 mb-4">Visualiza todas las alertas registradas en el sistema.</p>
              <button
                onClick={() => navigate('/alertas')}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Ver Alertas
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Buscar Alerta por ID</h2>
              <p className="text-gray-600 mb-4">Busca una alerta específica utilizando su ID.</p>
              <button
                onClick={() => navigate('/consultar-caso')}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Buscar Alerta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

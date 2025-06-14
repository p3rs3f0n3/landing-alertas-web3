// Landing.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getContract } from "../contract/contract";
import AgregarEvidencia from "./AgregarEvidencia";
import { useNavigate } from "react-router-dom";

export default function Landing({ provider }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadAlerts = useCallback(async () => {
    if (!provider) return;

    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const total = await contract.getTotalAlerts();
      const fetched = [];
      for (let i = 0; i < total; i++) {
        const alert = await contract.getAlert(i);
        fetched.push({ index: i, data: alert });
      }
      setAlerts(fetched);
    } catch (err) {
      console.error("Error cargando alertas:", err);
    } finally {
      setLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-800">
              🛑 Panel de Alertas
            </h1>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Volver al menú
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {!provider ? (
          <p className="text-center text-gray-500">🔌 Conecte su wallet desde el login para continuar.</p>
        ) : loading ? (
          <p className="text-center text-gray-500">Cargando alertas...</p>
        ) : alerts.length === 0 ? (
          <p className="text-center text-gray-500">No hay alertas registradas.</p>
        ) : (
          <div className="grid gap-6">
            {alerts.map(({ index, data }, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-lg p-4 border-l-4 border-red-500"
              >
                <div className="flex justify-between">
                  <h2 className="font-bold text-lg text-red-600">{data[2]}</h2>
                  <span className="text-sm text-gray-500">
                    {new Date(Number(data[5]) * 1000).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">
                  🆔 ID de evento: <strong>{data[1]}</strong>
                </p>
                <p className="text-gray-700 mt-2">
                  📍 Ubicación: <strong>{data[3]}, {data[4]}</strong>
                </p>
                <p className="text-gray-700">
                  📞 Contactos: {data[6].join(", ")}
                </p>
                <p className="text-gray-700">
                  📂 Evidencia: {data[7] ? "Presente" : "No agregada"}
                </p>


                <div className="mt-2 text-right">
                  <button
                    onClick={() => navigate(`/alerta/${index}`)}
                    className="text-sm text-blue-600 underline"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

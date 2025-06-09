import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { getContract } from "../contract/contract";
import AgregarEvidencia from "./AgregarEvidencia";
import { useNavigate } from "react-router-dom";

export default function Landing({ setProvider, provider }) {
  const [alerts, setAlerts] = useState([]);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      const prov = new ethers.BrowserProvider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const signer = await prov.getSigner();
      const addr = await signer.getAddress();
      setProvider(prov);        // aquí sí se debe usar
      setAccount(addr);
    } catch (error) {
      console.error("Conexión fallida:", error);
    }
  };

  const loadAlerts = useCallback(async () => {
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
    if (provider) {
      loadAlerts();
    }
  }, [provider, loadAlerts]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          🛑 Panel de Alertas de Emergencia
        </h1>

        {!account ? (
          <div className="text-center">
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
            >
              Conectar MetaMask
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-600 text-center">
              Conectado como: <span className="font-semibold">{account}</span>
            </p>

            {loading ? (
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
                      <h2 className="font-bold text-lg text-red-600">{data[1]}</h2>
                      <span className="text-sm text-gray-500">
                        {new Date(Number(data[4]) * 1000).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">
                      📍 Ubicación: <strong>{data[2]}, {data[3]}</strong>
                    </p>
                    <p className="text-gray-700">
                      📞 Contactos: {data[5].join(", ")}
                    </p>
                    <p className="text-gray-700">
                      📂 Evidencia: {data[6] ? "Presente" : "No agregada"}
                    </p>

                    <div className="mt-4">
                      <AgregarEvidencia index={index} provider={provider} />
                    </div>
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
          </>
        )}
      </div>
    </div>
  );
}

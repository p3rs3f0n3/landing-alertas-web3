// ConsultarCaso.jsx
import React, { useState } from "react";
import { getContract } from "../contract/contract";
import AgregarEvidencia from "./AgregarEvidencia";
import { useNavigate } from "react-router-dom";

export default function ConsultarCaso({ provider }) {
  const [caseId, setCaseId] = useState("");
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const navigate = useNavigate();

  const consultarCaso = async () => {
    if (!caseId) {
      setError("Por favor ingrese un ID de caso");
      return;
    }

    if (!provider) {
      setError("Wallet no conectada. Por favor vuelva a iniciar sesión.");
      return;
    }

    setLoading(true);
    setError(null);
    setCaseData(null);
    setShowAddEvidence(false);

    try {
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const caso = await contract.getAlert(caseId);

      setCaseData({
        id: caso[1],
        titulo: caso[2],
        descripcion: caso[7],
        fecha: new Date(Number(caso[5]) * 1000).toLocaleString(),
        estado: caso[6].length > 0 ? "Con contactos" : "Sin contactos",
        index: caseId
      });
    } catch (error) {
      console.error("Error al consultar el caso:", error);
      setError("Error al consultar el caso. Verifique el ID e intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Consultar Caso</h2>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Volver al menú
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Ingrese ID del caso"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={consultarCaso}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {caseData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">Detalles del Caso</h3>
            <div className="space-y-2">
              <p><span className="font-medium">ID:</span> {caseData.id}</p>
              <p><span className="font-medium">Título:</span> {caseData.titulo}</p>
              <p><span className="font-medium">Descripción:</span> {caseData.descripcion || "No proporcionada"}</p>
              <p><span className="font-medium">Fecha:</span> {caseData.fecha}</p>
              <p><span className="font-medium">Estado:</span> {caseData.estado}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate(`/alerta/${caseData.index}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Ver detalle
              </button>
              <button
                onClick={() => setShowAddEvidence(!showAddEvidence)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                {showAddEvidence ? "Ocultar Formulario" : "Agregar Evidencia"}
              </button>
            </div>

            {showAddEvidence && (
              <div className="mt-4">
                <AgregarEvidencia index={caseId} provider={provider} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

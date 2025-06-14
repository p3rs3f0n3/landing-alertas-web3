import React, { useState } from "react";
import { getContract } from "../contract/contract";
import { useNavigate } from "react-router-dom";

export default function Reportes({ provider }) {
  const [loading, setLoading] = useState(false);
  const [alertId, setAlertId] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const generarPDFGeneral = async () => {
    if (!provider) return alert("Wallet no conectada");

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("⚠️ jsPDF no está disponible. Verifica que el CDN esté cargado.");
      return;
    }

    const { jsPDF } = window.jspdf;
    setLoading(true);

    try {
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const total = await contract.getTotalAlerts();

      const doc = new jsPDF();
      doc.text("Listado de Alertas", 14, 15);
      const rows = [];

      for (let i = 0; i < total; i++) {
        const a = await contract.getAlert(i);
        rows.push([i, a.userName, new Date(Number(a.timestamp) * 1000).toLocaleString()]);
      }

      doc.autoTable({
        head: [["ID", "Nombre", "Fecha"]],
        body: rows,
        startY: 20
      });

      doc.save("reporte_alertas_general.pdf");
    } catch (err) {
      console.error("Error generando reporte general:", err);
      alert("Error al generar reporte.");
    } finally {
      setLoading(false);
    }
  };

  const generarPDFDetalle = async () => {
    if (!alertId) return setError("Ingrese un ID válido");
    if (!provider) return alert("Wallet no conectada");

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("⚠️ jsPDF no está disponible. Verifica que el CDN esté cargado.");
      return;
    }

    const { jsPDF } = window.jspdf;
    setLoading(true);

    try {
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const a = await contract.getAlert(alertId);

      const doc = new jsPDF();
      doc.text("Reporte Detallado de Alerta", 14, 15);

      doc.autoTable({
        startY: 25,
        body: [
          ["ID", alertId],
          ["Nombre", a.userName],
          ["Ubicación", `${a.latitude}, ${a.longitude}`],
          ["Fecha", new Date(Number(a.timestamp) * 1000).toLocaleString()],
          ["Contactos", a.contacts.join(", ") || "Sin contactos"],
          ["Descripción", a.evidence.description || "No provista"],
          ["Imágenes", a.evidence.imageHashes?.join(", ") || "No hay"],
          ["Declaración", a.evidence.declarationText || "No hay"]
        ],
        theme: 'striped'
      });

      doc.save(`alerta_detalle_${alertId}.pdf`);
    } catch (err) {
      console.error("Error generando detalle:", err);
      alert("Error al generar reporte detallado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto mt-6">
<div className="flex justify-between items-center mb-6">
<h2 className="text-2xl font-bold mb-4 text-center">📄 Generador de Reportes</h2>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Volver al menú
          </button>
        </div>

      

      <div className="bg-white shadow p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-2">🔹 Reporte General</h3>
        <button
          onClick={generarPDFGeneral}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Generando..." : "Descargar Reporte General"}
        </button>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">🔹 Reporte por ID</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={alertId}
            onChange={(e) => setAlertId(e.target.value)}
            placeholder="ID de Alerta"
            className="border border-gray-300 px-3 py-2 rounded w-full"
          />
          <button
            onClick={generarPDFDetalle}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Generando..." : "Descargar Detalle"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { getContract } from "../contract/contract";

export default function AgregarEvidencia({ index, provider }) {
  const [desc, setDesc] = useState("");
  const [imgHash, setImgHash] = useState("");
  const [decl, setDecl] = useState("");
  const [message, setMessage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const submit = async () => {
    if (!desc || !imgHash || !decl) {
      setMessage({ type: "error", text: "Por favor completa todos los campos." });
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.addEvidenceToAlert(index, desc, [imgHash], decl);
      await tx.wait();

      setMessage({ type: "success", text: "✅ Evidencia agregada con éxito." });
      setDesc("");
      setImgHash("");
      setDecl("");
    } catch (error) {
      console.error("Error al agregar evidencia:", error);
      setMessage({ type: "error", text: "❌ Error al enviar la evidencia." });
    }
  };

  return (
    <div className="bg-gray-100 p-3 rounded-md mt-3">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-md font-semibold text-gray-700">
          Evidencia #{index}
        </h3>
        <span className="text-gray-500">
          {isExpanded ? "▼" : "▶"}
        </span>
      </div>

      {isExpanded && (
        <div className="grid gap-2 mt-2">
          <input
            type="text"
            placeholder="Descripción"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
          <input
            type="text"
            placeholder="Hash de imagen (IPFS)"
            value={imgHash}
            onChange={(e) => setImgHash(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
          <input
            type="text"
            placeholder="Declaración"
            value={decl}
            onChange={(e) => setDecl(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
          <button
            onClick={submit}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow w-full"
          >
            Guardar Evidencia
          </button>
          {message && (
            <p
              className={`text-sm mt-1 ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

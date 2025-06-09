import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContract } from "../contract/contract";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function AlertaDetalle({ provider }) {
  const { index } = useParams();
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const signer = await provider.getSigner();
        const contract = getContract(signer);
        const data = await contract.getAlert(index);
        setAlerta(data);
      } catch (error) {
        console.error("Error al cargar alerta:", error);
      }
    };
    if (provider) load();
  }, [index, provider]);

  if (!alerta) return <p className="text-center mt-4">Cargando alerta...</p>;

  const [user, lat, lon, timestamp, contacts, desc, imgs, decl] = [
    alerta[1],
    alerta[2],
    alerta[3],
    alerta[4],
    alerta[5],
    alerta[6],
    alerta[7],
    alerta[8],
  ];

  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto mt-6">
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Volver al listado
      </button>

      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Alerta de {user}
      </h2>

      <div className="grid gap-2 text-gray-700 mb-4">
        <p><strong>Ubicación:</strong> {lat}, {lon}</p>
        <p><strong>Fecha:</strong> {new Date(Number(timestamp) * 1000).toLocaleString()}</p>
        <p><strong>Contactos:</strong> {contacts.join(", ")}</p>
        <p><strong>Descripción de evidencia:</strong> {desc || "No proporcionada"}</p>
        <p><strong>Declaración:</strong> {decl || "No proporcionada"}</p>
        <p><strong>Imágenes:</strong> {imgs.length > 0 ? imgs.join(", ") : "No agregadas"}</p>
      </div>

      {parsedLat && parsedLon && (
        <MapContainer
          center={[parsedLat, parsedLon]}
          zoom={15}
          scrollWheelZoom={false}
          className="h-64 w-full rounded"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[parsedLat, parsedLon]}>
            <Popup>Ubicación de la alerta</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

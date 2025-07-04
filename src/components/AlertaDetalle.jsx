// AlertaDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContract } from "../contract/contract";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function AlertaDetalle({ provider }) {
  const { index } = useParams();
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!provider) {
        setError("Wallet no conectada. Por favor vuelva al login.");
        return;
      }

      try {
        const signer = await provider.getSigner();
        const contract = getContract(signer);
        
        // Get total number of alerts
        const totalAlerts = await contract.getTotalAlerts();
        
        // Search through all alerts to find the one with matching idEvent
        let foundAlert = null;
        for (let i = 0; i < totalAlerts; i++) {
          const alert = await contract.getAlert(i);
          if (alert[1] === index) { // alert[1] is the idEvent
            foundAlert = alert;
            break;
          }
        }

        if (!foundAlert) {
          setError("No se encontró la alerta con ese ID");
          return;
        }

        setAlerta(foundAlert);
      } catch (error) {
        console.error("Error al cargar alerta:", error);
        setError("No se pudo cargar la alerta. Verifique el ID.");
      }
    };
    load();
  }, [index, provider]);

  if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;
  if (!alerta) return <p className="text-center mt-4">Cargando alerta...</p>;

  const [idEvent, user, lat, lon, timestamp, contacts, desc, imgs, decl] = [
    alerta[1],
    alerta[2],
    alerta[3],
    alerta[4],
    alerta[5],
    alerta[6],
    alerta[7],
    alerta[8],
    alerta[9]
  ];

  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);

  const isValidCoordinates = !isNaN(parsedLat) && !isNaN(parsedLon) && 
    parsedLat >= -90 && parsedLat <= 90 && 
    parsedLon >= -180 && parsedLon <= 180;


  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto mt-6">
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Volver al menú
      </button>

      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Alerta de {user}
      </h2>

      <div className="grid gap-2 text-gray-700 mb-4">
        <p><strong>ID de evento:</strong> {idEvent}</p>
        <p><strong>Ubicación:</strong> {lat}, {lon}</p>
        <p><strong>Fecha:</strong> {new Date(Number(timestamp) * 1000).toLocaleString()}</p>
        <p><strong>Contactos:</strong> {contacts.join(", ")}</p>
        <p><strong>Descripción de evidencia:</strong> {desc || "No proporcionada"}</p>
        <p><strong>Declaración:</strong> {decl || "No proporcionada"}</p>
        <p><strong>Imágenes:</strong> {imgs.length > 0 ? imgs.join(", ") : "No agregadas"}</p>
      </div>

     {/* {parsedLat && parsedLon && (
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
     )}*/}

{/*{isValidCoordinates ? (
  <div className="h-[400px] w-full relative">
    <MapContainer
      key={`${parsedLat}-${parsedLon}`}
      center={[parsedLat, parsedLon]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(map) => {
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[parsedLat, parsedLon]}>
        <Popup>Ubicación de la alerta</Popup>
      </Marker>
    </MapContainer>
  </div>
) : (
  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
    No se puede mostrar el mapa: Coordenadas inválidas
  </div>
)}*/}
     
    </div>
  );
}

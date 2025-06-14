// LoginScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../images/Logof.png';
import { ethers } from "ethers";

export default function LoginScreen({ setLoggedIn, setProvider, setAccount }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const validUser = "admin";
    const validPass = "1234";

    if (username === validUser && password === validPass) {
      try {
        const prov = new ethers.BrowserProvider(window.ethereum);
        await prov.send("eth_requestAccounts", []);
        const signer = await prov.getSigner();
        const addr = await signer.getAddress();
        setProvider(prov);
        setAccount(addr);
        setLoggedIn(true);
        navigate("/");
      } catch (err) {
        setError("Error al conectar la wallet.");
      }
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-80">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="max-w-[200px] max-h-[200px] object-scale-down" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Login</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}

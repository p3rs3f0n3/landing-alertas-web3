import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import MainMenu from "./components/MainMenu";
import Landing from "./components/Landing";
import AlertaDetalle from "./components/AlertaDetalle";
import ConsultarCaso from "./components/ConsultarCaso";
import { ethers } from "ethers";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? (
              <MainMenu
                account={account}
                setLoggedIn={setLoggedIn}
                setProvider={setProvider}
                setAccount={setAccount}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/alertas"
          element={
            loggedIn ? (
              <Landing setProvider={setProvider} provider={provider} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/alerta/:index"
          element={
            loggedIn ? (
              <AlertaDetalle provider={provider} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/consultar-caso"
          element={
            loggedIn ? (
              <ConsultarCaso provider={provider} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            <LoginScreen
              setLoggedIn={setLoggedIn}
              setProvider={setProvider}
              setAccount={setAccount}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

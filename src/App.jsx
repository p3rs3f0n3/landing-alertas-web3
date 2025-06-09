import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import Landing from "./components/Landing";
import AlertaDetalle from "./components/AlertaDetalle";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
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
        <Route path="/login" element={<LoginScreen setLoggedIn={setLoggedIn} />} />
      </Routes>
    </Router>
  );
}

export default App;

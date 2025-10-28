import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";

import "./index.css";  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />

        <Route path="/*" element={<ClientLayout />} />
      </Routes>
    </Router>
  );
}

export default App;

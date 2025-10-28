import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import Home from "../src/pages/client/Home";
import "./index.css";  
import Contact from "../src/pages/client/Contact";
import Overview from "../src/pages/admin/Overview";
import ProductList from "../src/pages/admin/ProductList";
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="productList" element={<ProductList />} />
        </Route>
        <Route path="/*" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import Home from "../src/pages/client/Home";
import "./index.css";  
import Contact from "../src/pages/client/Contact";
import Overview from "../src/pages/admin/Overview";
import ProductList from "../src/pages/admin/ProductList";
import Customers from "./pages/admin/Customers/List";
import List from "../src/pages/admin/CustomerGroup/List";
import AddCustomerGroup from "../src/pages/admin/CustomerGroup/Add";
import UpdateCustomerGroup from "../src/pages/admin/CustomerGroup/Update";
import Test from "../src/pages/admin/Test";
import Employee from "../src/pages/admin/Employee/List";
import Role from "../src/pages/admin/RoleManagement";
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="productList" element={<ProductList />} />
            <Route path="customerList" element={<Customers />} />
            <Route path="customer-group" element={<List />} />
            <Route path="customer-group/add" element={<AddCustomerGroup />} />
            <Route path="customer-group/update/:id" element={<UpdateCustomerGroup />} />
            <Route path="employee/list" element={<Employee />} />
            <Route path="role" element={<Role />} />
        </Route>
        <Route path="/*" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

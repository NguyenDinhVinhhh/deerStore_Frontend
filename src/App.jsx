import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import ProtectedRoute from "../src/components/ProtectedRoute";

import ClientLayout from "./layouts/ClientLayout";
import Home from "../src/pages/client/Home";
import Contact from "../src/pages/client/Contact";
import AllProduct from "../src/pages/client/AllProduct";
import Login from "../src/pages/client/Login";
import Overview from "../src/pages/admin/Overview";
import ProductList from "../src/pages/admin/Products/Products";

import AdminLayout from "./layouts/AdminLayout";
import Customers from "./pages/admin/Customers/Customer";
import CustomerGroup from "../src/pages/admin/CustomerGroup/CustomerGroup";
import EmployeeList from "../src/pages/admin/Employee/EmployeeList";
import Configuration from "./pages/admin/Configuration/Configuration";
import Nhaphang from "./pages/admin/Inventory/Inventory";
import Role from "./pages/admin/RoleManagement";
import NoPermission from "../src/pages/admin/NoPermission";

import Pos from "./layouts/Pos";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pos" element={<Pos />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="no-permission" element={<NoPermission />} />

          <Route
            path="products"
            element={
              <ProtectedRoute permission="XEM_SAN_PHAM">
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="nhap-hang"
            element={
              <ProtectedRoute permission="XEM">
                <Nhaphang />
              </ProtectedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <ProtectedRoute permission="XEM_DANH_SACH_KHACH_HANG">
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="customer-group"
            element={
              <ProtectedRoute permission="XEM">
                <CustomerGroup />
              </ProtectedRoute>
            }
          />
          <Route
            path="customer-group/add"
            element={
              <ProtectedRoute permission="THEM_NHOM_KHACH_HANG">
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="customer-group/update/:id"
            element={
              <ProtectedRoute permission="SUA_NHOM_KHACH_HANG">
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee/list"
            element={
              <ProtectedRoute permission="XEM_NHAN_VIEN">
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute permission="XEM">
                <Configuration />
              </ProtectedRoute>
            }
          />
          <Route
            path="role"
            element={
              <ProtectedRoute permission="XEM_QUYEN">
                <Role />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/*" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="all-product" element={<AllProduct />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import Pos from "./layouts/Pos";

import ProtectedRoute from "./components/ProtectedRoute";
import NoPermission from "./pages/admin/NoPermission";

import Home from "./pages/client/Home";
import Contact from "./pages/client/Contact";
import AllProduct from "./pages/client/AllProduct";
import Login from "./pages/client/Login";
import Register from "./components/client/Register";
import PurchaseHistory from "./pages/client/PurchaseHistory";
import Stores from "./pages/client/Stores";

import Dashboard from "./pages/admin/Dashboard/Dashboard";
import ProductList from "./pages/admin/Products/Products";
import Customers from "./pages/admin/Customers/Customer";
import CustomerGroup from "./pages/admin/CustomerGroup/CustomerGroup";
import EmployeeList from "./pages/admin/Employee/EmployeeList";
import Configuration from "./pages/admin/Configuration/Configuration";
import Nhaphang from "./pages/admin/Inventory/Inventory";
import Invoices from "./pages/admin/Invoice/InvoiceList";
import Role from "./pages/admin/RoleManagement";
import SalesReport from "./pages/admin/Report/SalesReport";
import Overview from "./pages/admin/Overview";

function App() {
  return (
    <Router>
      <Routes>
        {/* Tuyến đường bán hàng tại quầy */}
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <Pos />
            </ProtectedRoute>
          }
        />

        {/* 1. LỚP BẢO VỆ TOÀN CỤC: Chặn Khách hàng truy cập vào /admin 
          Chỉ người dùng có userType === 'ADMIN' mới được render AdminLayout
        */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Các trang mặc định trong Admin không yêu cầu permission cụ thể */}
          <Route index element={<Dashboard />} />
          <Route path="overview" element={<Dashboard />} />
          <Route path="no-permission" element={<NoPermission />} />
          <Route path="xem-danh-sach-don-hang" element={<Invoices />} />
          <Route path="bao-cao-san-pham" element={<SalesReport />} />

          {/* 2. LỚP BẢO VỆ CHI TIẾT: Chặn nhân viên truy cập trái quyền hạn 
            Kiểm tra permission cụ thể trong danh sách đã lưu ở localStorage
          */}
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

        {/* Cụm Route công khai cho Khách hàng */}
        <Route path="/*" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="all-product" element={<AllProduct />} />
          <Route path="stores" element={<Stores />} />
          <Route path="contact" element={<Contact />} />
          <Route path="purchase-history" element={<PurchaseHistory />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>

      {/* Thông báo toàn cục */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

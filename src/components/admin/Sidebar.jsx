import { useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../../utils/permission";

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState({
    product: false,
    customer: false,
    staff: false,
    config: false,
  });

  const navigate = useNavigate();
  const path = window.location.pathname;

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleNavigate = (path, permission) => {
    if (!permission || hasPermission(permission)) {
      navigate(path);
    } else {
      navigate("/admin/no-permission");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4 className="sidebar-logo">DeerStore</h4>
      </div>

      <ul className="nav flex-column">
        {/* Tổng quan */}
        <li className="nav-item mb-2">
          <button
            className={`nav-link text-white w-100 text-start ${
              path === "/admin" ? "active" : ""
            }`}
            onClick={() => handleNavigate("/admin")}
          >
            <i className="bi bi-house-door me-2"></i> Tổng quan
          </button>
        </li>
        {/* SẢN PHẨM */}
        <li className="nav-item mb-2">
          <button
            className={`nav-link text-white w-100 text-start d-flex justify-content-between ${
              path.includes("/admin/products") ||
              path.includes("/admin/nhap-kho") ||
              path.includes("/admin/nhap-hang") ||
              path.includes("/admin/kiem-hang") ||
              path.includes("/admin/nha-cung-cap")
                ? "active"
                : ""
            }`}
            onClick={() => toggleMenu("product")}
          >
            <span>
              <i className="bi bi-box-seam me-2"></i> Sản phẩm
            </span>
            <i
              className={`bi ${
                openMenus.product ? "bi-caret-down-fill" : "bi-caret-right-fill"
              }`}
            ></i>
          </button>

          {openMenus.product && (
            <ul className="nav flex-column ms-4 mt-2 submenu">
              <li>
                <button
                  className={`nav-link text-white-50 small text-start ${
                    path === "/admin/products" ? "active" : ""
                  }`}
                  onClick={() =>
                    handleNavigate("/admin/products", "XEM_SAN_PHAM")
                  }
                >
                  Danh sách sản phẩm
                </button>
              </li>

              <li>
                <button
                  className={`nav-link text-white-50 small text-start ${
                    path === "/admin/nhap-kho" ? "active" : ""
                  }`}
                  onClick={() => handleNavigate("/admin/nhap-kho", "NHAP_KHO")}
                >
                  Quản lý kho
                </button>
              </li>

              <li>
                <button
                  className={`nav-link text-white-50 small text-start ${
                    path === "/admin/nhap-hang" ? "active" : ""
                  }`}
                  onClick={() => handleNavigate("/admin/nhap-hang", "XEM")}
                >
                  Nhập hàng
                </button>
              </li>

              <li>
                <button
                  className={`nav-link text-white-50 small text-start ${
                    path === "/admin/kiem-hang" ? "active" : ""
                  }`}
                  onClick={() => handleNavigate("/admin/kiem-hang", "XEM")}
                >
                  Kiểm hàng
                </button>
              </li>

              <li>
                <button
                  className={`nav-link text-white-50 small text-start ${
                    path === "/admin/nha-cung-cap" ? "active" : ""
                  }`}
                  onClick={() =>
                    handleNavigate("/admin/nha-cung-cap", "XEM_NHA_CUNG_CAP")
                  }
                >
                  Nhà cung cấp
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* KHÁCH HÀNG */}
        <li className="nav-item mb-2">
          <button
            className={`nav-link text-white w-100 text-start d-flex justify-content-between ${
              path.includes("/admin/customers") ||
              path.includes("/admin/customer-group")
                ? "active"
                : ""
            }`}
            onClick={() => toggleMenu("customer")}
          >
            <span>
              <i className="bi bi-people me-2"></i> Khách hàng
            </span>
            <i
              className={`bi ${
                openMenus.customer
                  ? "bi-caret-down-fill"
                  : "bi-caret-right-fill"
              }`}
            ></i>
          </button>

          {openMenus.customer && (
            <ul className="nav flex-column ms-4 mt-2 submenu">
              <li>
                <button
                  // ĐÃ SỬA: Thay "/admin/customerList" bằng "/admin/customers" để khớp với đường dẫn điều hướng
                  className={`nav-link text-white-50 small text-start ${
                    path === "/admin/customers" ? "active" : ""
                  }`}
                  onClick={() =>
                    handleNavigate(
                      "/admin/customers",
                      "XEM_DANH_SACH_KHACH_HANG"
                    )
                  }
                >
                  Danh sách khách hàng
                </button>
              </li>
              <li>
                <button
                  className={`nav-link text-white-50 small text-start ${
                    path === "/admin/customer-group" ? "active" : ""
                  }`}
                  onClick={() => handleNavigate("/admin/customer-group", "XEM")}
                >
                  Hạng thành viên
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* BÁO CÁO */}
        <li className="nav-item mb-2">
          <button
            className={`nav-link text-white w-100 text-start ${
              path === "/admin/settingsss" ? "active" : ""
            }`}
            onClick={() => handleNavigate("/admin/settingsss", "XEM_SAN_PHAM")}
          >
            <i className="bi bi-graph-up"></i> Báo cáo
          </button>
        </li>
        {/* POS */}
        <li className="nav-item mb-2">
          <button
            className={`nav-link text-white w-100 text-start ${
              path === "/pos" ? "active" : ""
            }`}
            onClick={() => handleNavigate("/pos", "XEM_SAN_PHAM")}
          >
            <i className="bi bi-shop me-2"></i> Bán tại quầy
          </button>
        </li>
        {/* Cấu hình */}
        <li className="nav-item mb-2">
          <button
            className={`nav-link text-white w-100 text-start ${
              path === "/admin/settings" ? "active" : ""
            }`}
            onClick={() => handleNavigate("/admin/settings", "XEM")}
          >
            <i className="bi bi-gear me-2"></i> Cấu hình
          </button>
        </li>
      </ul>
    </div>
  );
}

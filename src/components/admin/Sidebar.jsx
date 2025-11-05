import { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
export default function Sidebar() {

  const [openMenus, setOpenMenus] = useState({
    staff: false,
    product: false,
    customer: false,
    config: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4 className="sidebar-logo">DeerStore</h4>
      </div>

      <ul className="nav flex-column">
        
        <li className="nav-item mb-2">
          <Link to="/admin" className="nav-link text-white">
            <i className="bi bi-bag-check me-2"></i> Tổng quan
          </Link>
        </li>

       
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <i className="bi bi-bag-check me-2"></i> Đơn hàng
          </a>
        </li>

      
        <li className="nav-item mb-2">
          <button
            className="nav-link text-white w-100 text-start border-0 bg-transparent d-flex align-items-center justify-content-between"
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
              {/* <li><a href="/productList" className="nav-link text-white-50 small">Danh sách sản phẩm</a></li> */}
               <Link to="/admin/productList" className="nav-link text-white-50 small">
                          Danh sách sản phẩm
                        </Link>
              <li><a href="#" className="nav-link text-white-50 small">Quản lý kho</a></li>
              <li><a href="#" className="nav-link text-white-50 small">Nhập hàng</a></li>
              <li><a href="#" className="nav-link text-white-50 small">Kiểm hàng</a></li>
              <li><a href="#" className="nav-link text-white-50 small">Nhà cung cấp</a></li>
            </ul>
          )}
        </li>

  
        <li className="nav-item mb-2">
          <button
            className="nav-link text-white w-100 text-start border-0 bg-transparent d-flex align-items-center justify-content-between"
            onClick={() => toggleMenu("customer")}
          >
            <span>
              <i className="bi bi-people me-2"></i> Khách hàng
            </span>
            <i
              className={`bi ${
                openMenus.customer ? "bi-caret-down-fill" : "bi-caret-right-fill"
              }`}
            ></i>
          </button>

          {openMenus.customer && (
            <ul className="nav flex-column ms-4 mt-2 submenu">
                <Link to="/admin/customerList" className="nav-link text-white-50 small">
                          Danh sách khách hàng
                        </Link>
              <Link to="/admin/customer-group" className="nav-link text-white-50 small">
                          Nhóm khách hàng
                        </Link>
            </ul>
          )}
        </li>

        
        <li className="nav-item mb-2">
          <button
            className="nav-link text-white w-100 text-start border-0 bg-transparent d-flex align-items-center justify-content-between"
            onClick={() => toggleMenu("staff")}
          >
            <span>
              <i className="bi bi-person-badge me-2"></i> Nhân viên
            </span>
            <i
              className={`bi ${
                openMenus.staff ? "bi-caret-down-fill" : "bi-caret-right-fill"
              }`}
            ></i>
          </button>

          {openMenus.staff && (
            <ul className="nav flex-column ms-4 mt-2 submenu">
              <Link to="/admin/employee/list" className="nav-link text-white-50 small">Danh sách nhân viên</Link>
              <li><a href="#" className="nav-link text-white-50 small">Chấm công</a></li>
              <li><a href="#" className="nav-link text-white-50 small">Phân ca làm</a></li>
              <li><a href="#" className="nav-link text-white-50 small">Lương thưởng</a></li>
            </ul>
          )}
        </li>

        
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <i className="bi bi-graph-up me-2"></i> Báo cáo
          </a>
        </li>

        
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <i className="bi bi-shop-window me-2"></i> Bán tại quầy
          </a>
        </li>

        
        <li className="nav-item mb-2">
          <button
            className="nav-link text-white w-100 text-start border-0 bg-transparent d-flex align-items-center justify-content-between"
            onClick={() => toggleMenu("config")}
          >
            <span>
              <i className="bi bi-gear me-2"></i> Cấu hình
            </span>
            <i
              className={`bi ${
                openMenus.config ? "bi-caret-down-fill" : "bi-caret-right-fill"
              }`}
            ></i>
          </button>

          {openMenus.config && (
            <ul className="nav flex-column ms-4 mt-2 submenu">
              <li><a href="#" className="nav-link text-white-50 small">Cài đặt hệ thống</a></li>
              <Link to="/admin/role" className="nav-link text-white-50 small">
                          Phân quyền
                        </Link>
              <li><a href="#" className="nav-link text-white-50 small">Sao lưu dữ liệu</a></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

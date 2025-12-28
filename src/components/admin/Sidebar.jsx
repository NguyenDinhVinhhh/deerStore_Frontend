import { useState } from "react";
import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { hasPermission } from "../../utils/permission";

const SubItem = ({ path, label, permission }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <li>
      <button
        className={`nav-link text-white-50 small text-start ${
          pathname === path ? "active" : ""
        }`}
        onClick={() =>
          !permission || hasPermission(permission)
            ? navigate(path)
            : navigate("/admin/no-permission")
        }
      >
        {label}
      </button>
    </li>
  );
};

export default function Sidebar() {
  const [open, setOpen] = useState({});
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const NavItem = ({ icon, label, path }) => (
    <li className="nav-item mb-2">
      <button
        className={`nav-link text-white w-100 text-start ${
          pathname === path ? "active" : ""
        }`}
        onClick={() => navigate(path)}
      >
        <i className={`bi ${icon} me-2`}></i> {label}
      </button>
    </li>
  );

  const Group = ({ icon, label, k, active, children }) => (
    <li className="nav-item mb-2">
      <button
        className={`nav-link text-white w-100 text-start d-flex justify-content-between ${
          active ? "active" : ""
        }`}
        onClick={() => toggle(k)}
      >
        <span>
          <i className={`bi ${icon} me-2`}></i> {label}
        </span>
        <i
          className={`bi ${
            open[k] ? "bi-caret-down-fill" : "bi-caret-right-fill"
          }`}
        ></i>
      </button>
      {open[k] && (
        <ul className="nav flex-column ms-4 mt-2 submenu">{children}</ul>
      )}
    </li>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4 className="sidebar-logo">DeerStore</h4>
      </div>

      <ul className="nav flex-column">
        <NavItem icon="bi-house-door" label="Tổng quan" path="/admin" />

        {/* ĐƠN HÀNG */}
        <Group
          k="don"
          icon="bi-receipt"
          label="Đơn hàng"
          active={pathname.includes("/admin/hoa-don")}
        >
          <SubItem
            path="/admin/xem-danh-sach-don-hang"
            label="Danh sách đơn hàng"
          />
          <SubItem path="/admin/khach-tra-hang" label="Khách trả hàng" />
          <SubItem path="/admin/hoa-don-dien-tu" label="Hóa đơn điện tử" />
        </Group>

        {/* SẢN PHẨM */}
        <Group
          k="product"
          icon="bi-box-seam"
          label="Sản phẩm"
          active={pathname.includes("/admin/products")}
        >
          <SubItem path="/admin/products" label="Danh sách sản phẩm" />
          <SubItem path="/admin/nhap-hang" label="Nhập hàng" />
          <SubItem path="/admin/kiem-hang" label="Kiểm hàng" />
          <SubItem path="/admin/chuyen-hang" label="Chuyển hàng" />
          <SubItem path="/admin/nha-cung-cap" label="Nhà cung cấp" />
        </Group>

        {/* KHÁCH HÀNG */}
        <Group
          k="customer"
          icon="bi-people"
          label="Khách hàng"
          active={pathname.includes("/admin/customers")}
        >
          <SubItem path="/admin/customers" label="Danh sách khách hàng" />
          <SubItem path="/admin/customer-group" label="Hạng thành viên" />
        </Group>

        {/* BÁO CÁO */}
        <Group
          k="baocao"
          icon="bi-bar-chart-line"
          label="Báo cáo"
          active={pathname.includes("/admin/bao-cao")}
        >
          <SubItem path="/admin/bao-cao-san-pham" label="Báo cáo sản phẩm" />
          <SubItem path="/admin/bao-cao-nhap-hang" label="Báo cáo nhập hàng" />
          <SubItem path="/admin/bao-cao-kho" label="Báo cáo kho" />
          <SubItem
            path="/admin/bao-cao-khach-hang"
            label="Báo cáo khách hàng"
          />
        </Group>

        <NavItem icon="bi-shop" label="Bán tại quầy" path="/pos" />
        <NavItem icon="bi-gear" label="Cấu hình" path="/admin/settings" />
      </ul>
    </div>
  );
}

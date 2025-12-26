import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  let name = location.pathname;

  if (name === "/admin") {
    name = "Tổng quan";
  } else if (name === "/admin/productList") {
    name = "Danh sách sản phẩm";
  } else if (name === "/admin/role") {
    name = "Quản lý vai trò và phân quyền";
  } else if (name === "/admin/customerList") {
    name = "Khách hàng";
  } else if (name === "/admin/customer-group") {
    name = "Hạng thành viên";
  } else if (name === "/admin/customer-group/add") {
    name = "Thêm nhóm khách hàng";
  } else if (name === "/admin/settings") {
    name = "Cấu hình";
  } else if (name === "/admin/products") {
    name = "Danh sách sản phẩm ";
  } else if (name === "/admin/customers") {
    name = "Quản lý khách hàng ";
  } else if (name === "/admin/xem-danh-sach-don-hang") {
    name = "Danh sách đơn hàng ";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-light shadow-sm px-4">
      <span className="navbar-brand mb-0 h4">{name}</span>
      <div>
        <button
          className="btn btn-outline-secondary me-2"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>

        <button className="btn btn-outline-primary">
          {JSON.parse(localStorage.getItem("user"))?.hoTen || "Vinh"}
        </button>
      </div>
    </nav>
  );
}


import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  let name = location.pathname;
  if(name == "/admin")
    {
      name = "Tổng quan";
    }
  else if(name == "/admin/productList"){
    name = "Danh sách sản phẩm ";
  }
  else if(name=="/admin/role"){
    name = "Quản lý vai trò và phân quyền";
  }
  else if(name=="/admin/customerList")
    {
      name = "Khách hàng";
    }
  else if(name =="/admin/customer-group")
    {
      name="Nhóm khách hàng";
    } 
  else if(name == "/admin/customer-group/add" )
    {
      name = "Thêm nhóm khách hàng";
    }  
  return (
    <nav className="navbar navbar-light bg-light shadow-sm px-4">
      <span className="navbar-brand mb-0 h4">{name}</span>
      <div>
        <button className="btn btn-outline-secondary me-2">Trợ giúp</button>
        <button className="btn btn-outline-primary">Vinh ▼</button>
      </div>
    </nav>
  );
}

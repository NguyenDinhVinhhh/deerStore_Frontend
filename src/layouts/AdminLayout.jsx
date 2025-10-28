import {Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
export default function AdminLayout() {
  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <div className="flex-grow-1 overflow-auto bg-light">
                <Outlet/>
        </div>
      </div>
    </div>

  );
}

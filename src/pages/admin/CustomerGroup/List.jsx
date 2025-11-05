import React, { useEffect, useState } from "react";
import customerGroupApi from "../../../services/customerGroupApi";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function List() {
  const [nhoms, setNhoms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await customerGroupApi.getAll();
        setNhoms(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddClick = () => navigate("/admin/customer-group/add");

  const handleRowClick = (maNhom) => {
    navigate(`/admin/customer-group/delete/${maNhom}`); // ✅ chuyển qua trang xóa
  };

  return (
    <div className="p-4">
      {/* --- Header --- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Danh sách nhóm khách hàng</h4>
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2"
          onClick={handleAddClick}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Thêm nhóm khách hàng</span>
        </Button>
      </div>

      {/* --- Bảng danh sách --- */}
      <table className="table table-bordered table-hover align-middle shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Mã nhóm</th>
            <th>Tên nhóm</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {nhoms.length > 0 ? (
            nhoms.map((n) => (
              <tr
  key={n.maNhom}
  style={{ cursor: "pointer", transition: "0.2s" }}
  onClick={() => navigate(`/admin/customer-group/update/${n.maNhom}`)}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
>
  <td>{n.maNhom}</td>
  <td>{n.tenNhom}</td>
  <td>{n.moTa}</td>
  <td>{n.trangThai ? "Hoạt động" : "Ngưng"}</td>
</tr>

            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-muted py-3">
                Không có nhóm khách hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import employeeApi from "../../../services/employeeApi";

export default function List() {
  const [employees, setEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, reset } = useForm();

  // 🔹 Lấy danh sách nhân viên khi load trang
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await employeeApi.getAll();
      setEmployees(res);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân viên:", error);
    }
  };

  // 🔹 Xử lý tìm kiếm
  const onSearch = async (data) => {
    if (!data.keyword.trim()) {
      fetchEmployees();
      return;
    }
    try {
      const res = await employeeApi.search(data.keyword);
      setEmployees(res);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  return (
    <div className="p-4 bg-light rounded shadow-sm mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Danh sách nhân viên</h4>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle me-1"></i> Thêm nhân viên
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <form
        onSubmit={handleSubmit(onSearch)}
        className="d-flex align-items-center mb-3"
      >
        <input
          type="text"
          className="form-control me-2"
          placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
          {...register("keyword")}
        />
        <button type="submit" className="btn btn-outline-primary">
          <i className="bi bi-search"></i> Tìm kiếm
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary ms-2"
          onClick={() => {
            reset();
            fetchEmployees();
          }}
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </form>

      {/* Bảng danh sách nhân viên */}
      <div className="table-responsive">
        <table className="table table-striped align-middle text-center">
          <thead className="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Họ tên</th>
              <th scope="col">Email</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Mã vai trò</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((nv, index) => (
                <tr key={nv.maNv}>
                  <td>{index + 1}</td>
                  <td>{nv.hoTen}</td>
                  <td>{nv.email}</td>
                  <td>{nv.sdt}</td>
                  <td>{nv.diaChi}</td>
                  <td>{nv.maVaiTro}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm btn-danger">
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-muted">
                  Không có dữ liệu nhân viên
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

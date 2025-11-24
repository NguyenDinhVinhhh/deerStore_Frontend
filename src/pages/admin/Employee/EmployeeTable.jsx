import { FaEdit } from "react-icons/fa";

// Component này cần nhận các props sau:
// - employees: array (danh sách nhân viên)
// - onEdit: function (hàm mở form sửa)

export default function EmployeeTable({ employees, onEdit }) {
  return (
    <table className="table table-hover align-middle">
      <thead>
        <tr>
          <th>#</th>
          <th>Họ tên</th>
          <th>SĐT</th>
          <th>Vai trò</th>
          <th>Chi nhánh</th>
          <th>Trạng thái</th>
          <th>Super Admin</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {employees.length === 0 ? (
          <tr>
            <td colSpan="8" className="text-center text-muted">
              Không tìm thấy tài khoản nào.
            </td>
          </tr>
        ) : (
          employees.map((emp, index) => {
            const empBranches =
              emp.chiNhanhList?.map((b) => b.tenChiNhanh).join(", ") || "—";

            return (
              <tr key={emp.maTk}>
                <td>{index + 1}</td>
                <td>{emp.hoTen}</td>
                <td>{emp.sdt || "—"}</td>
                {/* Sử dụng trường tenVaiTro có sẵn từ API */}
                <td>{emp.tenVaiTro || "—"}</td>
                <td>{empBranches}</td>
                <td>
                  <span
                    className={`badge ${
                      emp.trangThai ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {emp.trangThai ? "Hoạt động" : "Tạm khóa"}
                  </span>
                </td>
                <td>{emp.isSuperAdmin ? "Có" : "Không"}</td>
                <td>
                  <FaEdit
                    title="Sửa"
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => onEdit(emp)}
                  />
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

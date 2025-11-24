import { FaSave, FaTimes } from "react-icons/fa";

// Component này cần nhận các props sau:
// - isEditing: boolean (đang sửa hay thêm)
// - formData: object (dữ liệu form)
// - setFormData: function (hàm cập nhật dữ liệu form)
// - branches: array (danh sách chi nhánh)
// - roles: array (danh sách vai trò)
// - handleSubmit: function (hàm xử lý gửi form)
// - onCancel: function (hàm đóng form)

export default function EmployeeForm({
  isEditing,
  formData,
  setFormData,
  branches,
  roles,
  handleSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={handleSubmit} className="border rounded p-3 mb-4 bg-light">
      <h5 className="mb-3 text-primary">
        {isEditing ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
      </h5>
      <div className="row g-3">
        {/* Hàng 1: Tên đăng nhập, Mật khẩu, Họ tên, SĐT, Email */}
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tên đăng nhập"
            value={formData.tenDangNhap}
            onChange={(e) =>
              setFormData({ ...formData, tenDangNhap: e.target.value })
            }
            required={!isEditing}
          />
        </div>

        <div className="col-md-3">
          <input
            type="password"
            className="form-control"
            placeholder={
              isEditing ? "Mật khẩu (Để trống nếu không đổi)" : "Mật khẩu"
            }
            value={formData.matKhau}
            onChange={(e) =>
              setFormData({ ...formData, matKhau: e.target.value })
            }
            required={!isEditing}
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Họ tên"
            value={formData.hoTen}
            onChange={(e) =>
              setFormData({ ...formData, hoTen: e.target.value })
            }
            required
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Số điện thoại"
            value={formData.sdt}
            onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
          />
        </div>

        <div className="col-md-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        {/* Hàng 2: Vai trò, Chi nhánh, Trạng thái, Super Admin, Nút hành động */}
        <div className="col-md-3">
          <select
            className="form-select"
            value={formData.maVaiTro}
            onChange={(e) =>
              setFormData({ ...formData, maVaiTro: e.target.value })
            }
            required
          >
            <option value="">-- Chọn vai trò --</option>
            {roles.map((role) => (
              <option key={role.maVaiTro} value={role.maVaiTro}>
                {role.tenVaiTro}
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox chi nhánh */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Chi nhánh:</label>
          <div
            className="border rounded p-2"
            style={{ maxHeight: 150, overflowY: "auto" }}
          >
            {branches.map((branch) => (
              <div className="form-check" key={branch.maChiNhanh}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`branch-${branch.maChiNhanh}`}
                  value={branch.maChiNhanh}
                  checked={formData.maChiNhanhList.includes(branch.maChiNhanh)}
                  onChange={(e) => {
                    const value = branch.maChiNhanh;
                    let newList = [...formData.maChiNhanhList];
                    if (e.target.checked) {
                      newList.push(value);
                    } else {
                      newList = newList.filter((id) => id !== value);
                    }
                    setFormData({
                      ...formData,
                      maChiNhanhList: newList,
                    });
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`branch-${branch.maChiNhanh}`}
                >
                  {branch.tenChiNhanh}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={formData.trangThai}
            onChange={(e) =>
              setFormData({
                ...formData,
                trangThai: e.target.value === "true",
              })
            }
          >
            <option value="true">Hoạt động</option>
            <option value="false">Tạm khóa</option>
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={formData.isSuperAdmin}
            onChange={(e) =>
              setFormData({
                ...formData,
                isSuperAdmin: e.target.value === "true",
              })
            }
          >
            <option value="false">Không Super Admin</option>
            <option value="true">Super Admin</option>
          </select>
        </div>

        <div className="col-md-2 text-end">
          <button type="submit" className="btn btn-success me-2">
            <FaSave className="me-2" />
            Lưu
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            <FaTimes className="me-2" /> Hủy
          </button>
        </div>
      </div>
    </form>
  );
}

import { useState } from "react";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import authApi from "../../../services/loginApi";
import "./List.css"; // Giữ lại style cũ

// Import các components con
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";

// Import các hooks
import { useEmployee } from "../../../hooks/use-employee";
import { useBranch } from "../../../hooks/use-branchs";
import { useRole } from "../../../hooks/use-roles";

export default function EmployeeList({ onBack }) {
  // Lấy dữ liệu
  const {
    data: employees = [],
    isLoading: loadingEmployees,
    refetch: refetchEmployees,
  } = useEmployee();

  const { data: roles = [], isLoading: loadingRoles } = useRole();
  const { data: branches = [], isLoading: loadingBranches } = useBranch();

  // Trạng thái form
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Trạng thái dữ liệu form
  const [formData, setFormData] = useState({
    tenDangNhap: "",
    matKhau: "",
    hoTen: "",
    sdt: "",
    email: "",
    maVaiTro: "",
    maChiNhanhList: [],
    trangThai: true,
    isSuperAdmin: false,
  });

  // HÀM XỬ LÝ

  const handleAdd = () => {
    // Reset form data
    setFormData({
      tenDangNhap: "",
      matKhau: "",
      hoTen: "",
      sdt: "",
      email: "",
      maVaiTro: "",
      maChiNhanhList: [],
      trangThai: true,
      isSuperAdmin: false,
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (emp) => {
    // Cập nhật form data từ dữ liệu nhân viên
    setFormData({
      tenDangNhap: emp.tenDangNhap || "",
      matKhau: "", // Reset mật khẩu khi sửa
      hoTen: emp.hoTen || "",
      sdt: emp.sdt || "",
      email: emp.email || "",
      maVaiTro: String(emp.maVaiTro) || "",
      maChiNhanhList: emp.chiNhanhList?.map((b) => b.maChiNhanh) || [],
      trangThai: emp.trangThai,
      isSuperAdmin: emp.isSuperAdmin,
    });
    setSelectedId(emp.maTk);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        tenDangNhap: formData.tenDangNhap,
        matKhau:
          isEditing && formData.matKhau === "" ? undefined : formData.matKhau,
        hoTen: formData.hoTen,
        sdt: formData.sdt,
        email: formData.email,
        maVaiTro: Number(formData.maVaiTro),
        danhSachChiNhanh: formData.maChiNhanhList.map(Number),
        trangThai: formData.trangThai,
        isSuperAdmin: formData.isSuperAdmin,
      };

      if (isEditing) {
        await authApi.update(selectedId, payload);
      } else {
        await authApi.registerStaff(payload);
      }

      refetchEmployees();
      setShowForm(false);
    } catch (error) {
      console.error("Lỗi khi lưu nhân viên:", error);
      alert("Lỗi khi lưu nhân viên. Vui lòng kiểm tra console.");
    }
  };

  // Xử lý Loading
  const isOverallLoading = loadingEmployees || loadingRoles || loadingBranches;

  if (isOverallLoading) {
    return (
      <div className="text-center p-5">
        Đang tải dữ liệu (Tài khoản, Vai trò, Chi nhánh)...
      </div>
    );
  }

  return (
    <div className="employee-page p-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-light border" onClick={onBack}>
                <FaArrowLeft className="me-2" /> Quay lại
              </button>
              <h5 className="fw-bold m-0">Quản lý tài khoản</h5>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={!roles.length || !branches.length}
            >
              <FaUserPlus className="me-2" /> Thêm tài khoản
            </button>
          </div>

          {/* Form thêm / sửa */}
          {showForm && (
            <EmployeeForm
              isEditing={isEditing}
              formData={formData}
              setFormData={setFormData}
              branches={branches}
              roles={roles}
              handleSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Danh sách tài khoản */}
          {!showForm && (
            <EmployeeTable employees={employees} onEdit={handleEdit} />
          )}
        </div>
      </div>
    </div>
  );
}

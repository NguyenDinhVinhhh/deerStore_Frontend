import React, { useEffect, useState } from "react";
import roleApi from "../../../services/roleApi";
import authoritiesApi from "../../../services/authoritiesApi";
import { Table, Button, Spinner, Form, Modal } from "react-bootstrap";
import { FaKey, FaPlus, FaArrowLeft } from "react-icons/fa";

export default function RolePermissionPage({ onBack }) {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]); // Mảng chứa tenQuyen (String)
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ tenVaiTro: "", moTa: "" });
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Fetch danh sách vai trò
  const fetchRoles = async () => {
    try {
      const res = await roleApi.getAll();
      setRoles(res.data || res);
    } catch (error) {
      console.error("Lỗi tải danh sách vai trò:", error);
    }
  };

  // 🔹 Fetch danh sách quyền tổng quát
  const fetchPermissions = async () => {
    try {
      const res = await authoritiesApi.getAll();
      setPermissions(res.data || res);
    } catch (error) {
      console.error("Lỗi tải danh sách quyền:", error);
    }
  };

  // 🔹 Lấy quyền thực tế của một vai trò cụ thể
  const fetchRolePermissions = async (roleId) => {
    setLoading(true);
    try {
      const res = await roleApi.getPermissions(roleId);
      // Đảm bảo dữ liệu lưu vào là mảng các chuỗi tên quyền
      const data = res.data || res;
      setRolePermissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải quyền vai trò:", error);
      setRolePermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // 🔹 Chọn vai trò từ danh sách bên trái
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    fetchRolePermissions(role.maVaiTro);
  };

  // 🔹 Kiểm tra xem một quyền cụ thể đã được gán chưa
  // Logic này quan trọng để hiển thị trạng thái của Switch
  const hasPermission = (permission) => {
    if (!rolePermissions || !permission) return false;
    return rolePermissions.includes(permission.tenQuyen);
  };

  // 🔹 Gán hoặc gỡ quyền (Optimistic UI Update)
  const handleTogglePermission = async (permission) => {
    if (!selectedRole) return;
    const roleId = selectedRole.maVaiTro;
    const permissionName = permission.tenQuyen;

    // 1. Xác định trạng thái trước khi thay đổi
    const isCurrentlyAssigned = hasPermission(permission);
    const previousPermissions = [...rolePermissions];

    // 2. Cập nhật giao diện ngay lập tức (Optimistic Update)
    if (isCurrentlyAssigned) {
      setRolePermissions((prev) =>
        prev.filter((name) => name !== permissionName)
      );
    } else {
      setRolePermissions((prev) => [...prev, permissionName]);
    }

    try {
      // 3. Gọi API thực tế dựa trên trạng thái cũ
      if (isCurrentlyAssigned) {
        await roleApi.removePermission(roleId, permission.maQuyen);
      } else {
        await roleApi.assignPermission(roleId, permission.maQuyen);
      }
    } catch (error) {
      console.error("Lỗi cập nhật quyền:", error);
      // Rollback nếu API thất bại
      setRolePermissions(previousPermissions);
      alert("Cập nhật quyền thất bại, vui lòng thử lại!");
    }
  };

  // 🔹 Modal thêm vai trò
  const handleShowModal = () => {
    setNewRole({ tenVaiTro: "", moTa: "" });
    setShowModal(true);
  };

  const handleAddRole = async () => {
    if (!newRole.tenVaiTro.trim()) {
      alert("Tên vai trò không được để trống!");
      return;
    }
    try {
      setSubmitting(true);
      await roleApi.create(newRole);
      setShowModal(false);
      fetchRoles();
    } catch (error) {
      console.error("Lỗi thêm vai trò:", error);
      alert("Không thể thêm vai trò!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-light border" onClick={onBack}>
          <FaArrowLeft className="me-2" /> Quay lại
        </button>
        <h4 className="fw-bold">
          <FaKey className="me-2 text-primary" />
          Phân quyền hệ thống
        </h4>
        <Button variant="success" onClick={handleShowModal}>
          <FaPlus className="me-2" /> Thêm vai trò
        </Button>
      </div>

      <div className="row">
        {/* Danh sách vai trò bên trái */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-header fw-bold bg-white py-3">
              Danh sách vai trò
            </div>
            <div className="card-body p-0">
              <Table hover className="mb-0">
                <tbody>
                  {roles.map((role) => (
                    <tr
                      key={role.maVaiTro}
                      onClick={() => handleSelectRole(role)}
                      className={
                        selectedRole?.maVaiTro === role.maVaiTro
                          ? "table-primary"
                          : ""
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td className="p-3 border-0">
                        <span
                          className={
                            selectedRole?.maVaiTro === role.maVaiTro
                              ? "fw-bold"
                              : ""
                          }
                        >
                          {role.tenVaiTro}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>

        {/* Bảng chi tiết quyền bên phải */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header fw-bold bg-white py-3">
              Quyền của vai trò:{" "}
              {selectedRole ? (
                <span className="text-primary">{selectedRole.tenVaiTro}</span>
              ) : (
                "..."
              )}
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : selectedRole ? (
                <Table responsive hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "50px" }}>#</th>
                      <th>Tên quyền</th>
                      <th>Mô tả</th>
                      <th className="text-center" style={{ width: "100px" }}>
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm, idx) => (
                      <tr key={perm.maQuyen}>
                        <td>{idx + 1}</td>
                        <td className="fw-bold text-secondary">
                          {perm.tenQuyen}
                        </td>
                        <td className="small text-muted">{perm.moTa}</td>
                        <td className="text-center">
                          <Form.Check
                            type="switch"
                            id={`perm-${perm.maQuyen}`}
                            // !! ép kiểu về boolean để Switch hiển thị đúng On/Off
                            checked={!!hasPermission(perm)}
                            onChange={() => handleTogglePermission(perm)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5 text-muted">
                  Vui lòng chọn vai trò để thiết lập quyền.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Thêm vai trò */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Thêm vai trò mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tên vai trò</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                value={newRole.tenVaiTro}
                onChange={(e) =>
                  setNewRole({ ...newRole, tenVaiTro: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newRole.moTa}
                onChange={(e) =>
                  setNewRole({ ...newRole, moTa: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleAddRole}
            disabled={submitting}
          >
            {submitting ? "Đang xử lý..." : "Lưu vai trò"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

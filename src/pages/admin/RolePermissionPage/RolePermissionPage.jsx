import React, { useEffect, useState } from "react";
import roleApi from "../../../services/roleApi";
import authoritiesApi from "../../../services/authoritiesApi";
import { Table, Button, Spinner, Form, Modal } from "react-bootstrap";
import { FaSync, FaKey, FaPlus, FaArrowLeft } from "react-icons/fa";

export default function RolePermissionPage({ onBack }) {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]); // mảng tenQuyen
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

  // 🔹 Fetch danh sách quyền
  const fetchPermissions = async () => {
    try {
      const res = await authoritiesApi.getAll();
      setPermissions(res.data || res);
    } catch (error) {
      console.error("Lỗi tải danh sách quyền:", error);
    }
  };

  // 🔹 Lấy quyền theo vai trò
  const fetchRolePermissions = async (roleId) => {
    setLoading(true);
    try {
      const res = await roleApi.getPermissions(roleId);
      // res.data là mảng tenQuyen
      setRolePermissions(res.data || []);
    } catch (error) {
      console.error("Lỗi tải quyền vai trò:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // 🔹 Chọn vai trò
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    fetchRolePermissions(role.maVaiTro);
  };

  // 🔹 Kiểm tra quyền đã có chưa
  const hasPermission = (permission) =>
    rolePermissions.includes(permission.tenQuyen);

  // 🔹 Gán hoặc gỡ quyền
  const handleTogglePermission = async (permission) => {
    if (!selectedRole) return;
    const roleId = selectedRole.maVaiTro;
    try {
      if (hasPermission(permission)) {
        await roleApi.removePermission(roleId, permission.maQuyen);
      } else {
        await roleApi.assignPermission(roleId, permission.maQuyen);
      }
      fetchRolePermissions(roleId); // refresh trạng thái sau khi gán/xóa
    } catch (error) {
      console.error("Lỗi cập nhật quyền:", error);
    }
  };

  // 🔹 Mở modal thêm vai trò
  const handleShowModal = () => {
    setNewRole({ tenVaiTro: "", moTa: "" });
    setShowModal(true);
  };

  // 🔹 Gửi form thêm vai trò
  const handleAddRole = async () => {
    if (!newRole.tenVaiTro.trim()) {
      alert("Tên vai trò không được để trống!");
      return;
    }
    try {
      setSubmitting(true);
      await roleApi.create(newRole);
      setShowModal(false);
      fetchRoles(); // refresh danh sách
    } catch (error) {
      console.error("Lỗi thêm vai trò:", error);
      alert("Không thể thêm vai trò!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-light border" onClick={onBack}>
          <FaArrowLeft className="me-2" /> Quay lại
        </button>
        <h4 className="fw-bold">
          <FaKey className="me-2 text-primary" />
          Phân quyền hệ thống
        </h4>
        <div>
          <Button variant="success" className="me-2" onClick={handleShowModal}>
            <FaPlus className="me-2" /> Thêm vai trò
          </Button>
        </div>
      </div>

      <div className="row">
        {/* 🔹 Danh sách vai trò */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header fw-semibold bg-light">
              Danh sách vai trò
            </div>
            <div className="card-body p-0">
              <Table hover responsive className="m-0">
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
                      <td className="fw-medium p-3">{role.tenVaiTro}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>

        {/* 🔹 Chi tiết quyền */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header fw-semibold bg-light">
              Quyền của vai trò:{" "}
              {selectedRole ? (
                <span className="text-primary">{selectedRole.tenVaiTro}</span>
              ) : (
                <span className="text-muted">Chưa chọn vai trò</span>
              )}
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : selectedRole ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên quyền</th>
                      <th>Mô tả</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm, idx) => (
                      <tr key={perm.maQuyen}>
                        <td>{idx + 1}</td>
                        <td>{perm.tenQuyen}</td>
                        <td>{perm.moTa}</td>
                        <td className="text-center">
                          <Form.Check
                            type="switch"
                            id={`perm-${perm.maQuyen}`}
                            checked={hasPermission(perm)}
                            onChange={() => handleTogglePermission(perm)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">
                  Vui lòng chọn vai trò ở bên trái để xem và chỉnh sửa quyền.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Modal thêm vai trò */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm vai trò mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên vai trò</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên vai trò..."
                value={newRole.tenVaiTro}
                onChange={(e) =>
                  setNewRole({ ...newRole, tenVaiTro: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Nhập mô tả..."
                value={newRole.moTa}
                onChange={(e) =>
                  setNewRole({ ...newRole, moTa: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleAddRole}
            disabled={submitting}
          >
            {submitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import axios from "axios";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);

  const baseURL = "http://localhost:8080/api";

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${baseURL}/vaitro`);
      setRoles(res.data);
    } catch (error) {
      console.error("Lỗi khi tải vai trò:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await axios.get(`${baseURL}/quyen`);
      setPermissions(res.data);
    } catch (error) {
      console.error("Lỗi khi tải quyền:", error);
    }
  };

  // ===== Thêm vai trò mới =====
  const handleAddRole = async () => {
    if (newRole.trim() === "") return;
    try {
      const res = await axios.post(`${baseURL}/vaitro`, {
        tenVaiTro: newRole,
        moTa: "",
      });
      setRoles([...roles, res.data]);
      setNewRole("");
      setShowAddModal(false);
    } catch (error) {
      console.error("Lỗi khi thêm vai trò:", error);
    }
  };

  // ===== Khi chọn sửa quyền của 1 vai trò =====
  const handleEditPermissions = async (role) => {
    setSelectedRole(role);
    setLoadingPerms(true);
    try {
      const res = await axios.get(`${baseURL}/vaitro/${role.maVaiTro}/quyen`);
      setRolePermissions(res.data.map((q) => q.maQuyen));
    } catch (error) {
      console.error("Lỗi khi tải quyền vai trò:", error);
    } finally {
      setLoadingPerms(false);
    }
  };

  // ===== Khi tick/bỏ tick quyền =====
  const handlePermissionToggle = async (permId) => {
    if (!selectedRole) return;
    const hasPermission = rolePermissions.includes(permId);

    try {
      if (hasPermission) {
        await axios.delete(
          `${baseURL}/vaitro/${selectedRole.maVaiTro}/quyen/${permId}`
        );
        setRolePermissions(rolePermissions.filter((id) => id !== permId));
      } else {
        await axios.post(
          `${baseURL}/vaitro/${selectedRole.maVaiTro}/quyen/${permId}`
        );
        setRolePermissions([...rolePermissions, permId]);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
    }
  };

  return (
    <div className="p-3 bg-light rounded shadow-sm">
      <h4 className="mb-3">Quản lý vai trò & phân quyền</h4>

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowAddModal(true)}
      >
        + Thêm vai trò
      </Button>

      {/* Danh sách vai trò */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên vai trò</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.maVaiTro}>
              <td>{role.maVaiTro}</td>
              <td>{role.tenVaiTro}</td>
              <td>{role.moTa || "—"}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditPermissions(role)}
                >
                  Sửa quyền
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm vai trò */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm vai trò mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Tên vai trò</Form.Label>
              <Form.Control
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Nhập tên vai trò"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddRole}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chỉnh sửa quyền */}
      {selectedRole && (
        <Modal
          show={true}
          onHide={() => setSelectedRole(null)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Phân quyền cho: <strong>{selectedRole.tenVaiTro}</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingPerms ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
              </div>
            ) : (
              <Form>
                {permissions.map((perm) => (
                  <Form.Check
                    key={perm.maQuyen}
                    type="checkbox"
                    id={`perm-${perm.maQuyen}`}
                    label={`${perm.tenQuyen} (${perm.moTa || "Không mô tả"})`}
                    checked={rolePermissions.includes(perm.maQuyen)}
                    onChange={() => handlePermissionToggle(perm.maQuyen)}
                  />
                ))}
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedRole(null)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  // Các quyền giả định
  const availablePermissions = [
    "Xem báo cáo",
    "Thêm hàng",
    "Sửa hàng",
    "Bán hàng",
    "Quản lý nhân viên",
  ];

  // Gọi API lấy vai trò khi load trang
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/vaitro");
      // Gắn quyền giả định cho mỗi vai trò (tạm)
      const dataWithFakePerms = res.data.map((r) => ({
        ...r,
        permissions: [],
      }));
      setRoles(dataWithFakePerms);
    } catch (error) {
      console.error("Lỗi khi tải vai trò:", error);
    }
  };

  // Thêm vai trò mới vào DB
  const handleAddRole = async () => {
    if (newRole.trim() === "") return;
    try {
      const res = await axios.post("http://localhost:8080/api/vaitro", {
        tenVaiTro: newRole,
        moTa: "",
      });
      setRoles([
        ...roles,
        { ...res.data, permissions: [] }, // thêm quyền rỗng ban đầu
      ]);
      setNewRole("");
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi thêm vai trò:", error);
    }
  };

  // Xử lý toggle quyền
  const handlePermissionToggle = (perm) => {
    const updatedPermissions = selectedRole.permissions.includes(perm)
      ? selectedRole.permissions.filter((p) => p !== perm)
      : [...selectedRole.permissions, perm];

    setSelectedRole({ ...selectedRole, permissions: updatedPermissions });

    // Cập nhật state roles
    setRoles(
      roles.map((r) =>
        r.maVaiTro === selectedRole.maVaiTro
          ? { ...r, permissions: updatedPermissions }
          : r
      )
    );
  };

  return (
    <div className="p-3">
      <h4 className="mb-3">Quản lý vai trò</h4>

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        Thêm vai trò
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên vai trò</th>
            <th>Mô tả</th>
            <th>Quyền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.maVaiTro}>
              <td>{role.maVaiTro}</td>
              <td>{role.tenVaiTro}</td>
              <td>{role.moTa}</td>
              <td>{role.permissions.join(", ") || "Chưa có quyền"}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                >
                  Sửa quyền
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm vai trò */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddRole}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chỉnh sửa quyền */}
      {selectedRole && (
        <Modal show={true} onHide={() => setSelectedRole(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa quyền: {selectedRole.tenVaiTro}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {availablePermissions.map((perm) => (
                <Form.Check
                  type="checkbox"
                  key={perm}
                  label={perm}
                  checked={selectedRole.permissions.includes(perm)}
                  onChange={() => handlePermissionToggle(perm)}
                />
              ))}
            </Form>
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

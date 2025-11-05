import React, { useEffect, useState } from "react";
import { Form, Button, Table, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import vaiTroApi from "../../services/roleApi";
import quyenApi from "../../services/authoritiesApi";

export default function Test() {
  const { register, handleSubmit, reset } = useForm();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const roleRes = await vaiTroApi.getAll();
      const permRes = await quyenApi.getAll();
      setRoles(roleRes);
      setPermissions(permRes);
    };
    fetchData();
  }, []);

  const handleSelectRole = async (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);
    const data = await vaiTroApi.getPermissions(roleId);
    setRolePermissions(data);
  };

  const onSubmit = async (data) => {
    await vaiTroApi.assignPermission(selectedRole, data.permissionId);
    const updated = await vaiTroApi.getPermissions(selectedRole);
    setRolePermissions(updated);
    reset();
  };

  const handleRemove = async (permissionId) => {
    await vaiTroApi.removePermission(selectedRole, permissionId);
    const updated = await vaiTroApi.getPermissions(selectedRole);
    setRolePermissions(updated);
  };

  return (
    <div className="p-4 bg-light rounded shadow-sm mt-4">
      <h4 className="mb-3">Phân quyền cho vai trò</h4>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Select onChange={handleSelectRole}>
            <option value="">-- Chọn vai trò --</option>
            {roles.map((r) => (
              <option key={r.maVaiTro} value={r.maVaiTro}>
                {r.tenVaiTro}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {selectedRole && (
        <>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <Row>
              <Col md={6}>
                <Form.Select {...register("permissionId")}>
                  <option value="">-- Chọn quyền để thêm --</option>
                  {permissions.map((p) => (
                    <option key={p.maQuyen} value={p.maQuyen}>
                      {p.tenQuyen}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button type="submit" variant="primary">
                  Thêm quyền
                </Button>
              </Col>
            </Row>
          </Form>

          <Table bordered hover>
            <thead>
              <tr>
                <th>Mã quyền</th>
                <th>Tên quyền</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rolePermissions.map((q) => (
                <tr key={q.maQuyen}>
                  <td>{q.maQuyen}</td>
                  <td>{q.tenQuyen}</td>
                  <td>{q.moTa}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(q.maQuyen)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}

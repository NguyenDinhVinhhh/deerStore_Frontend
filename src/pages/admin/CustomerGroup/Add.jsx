import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import customerGroupApi from "../../../services/customerGroupApi";

export default function Add() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenNhom: "",
    moTa: "",
    trangThai: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => navigate("/admin/customer-group");

  const handleSave = async () => {
    if (!formData.tenNhom.trim()) {
      alert("Vui lòng nhập tên nhóm khách hàng!");
      return;
    }

    try {
      setLoading(true);
      await customerGroupApi.add(formData);
      alert("✅ Thêm nhóm khách hàng thành công!");
      navigate("/admin/customer-group");
    } catch (error) {
      console.error("❌ Lỗi khi thêm nhóm khách hàng:", error);
      alert("Thêm thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex m-5"
      style={{ Height: "85vh" }}
    >
      <div
        className="bg-white p-4 rounded shadow-sm"
        style={{ width: "1200px" }}
      >
        
        <div className="d-flex align-items-center mb-4">
        <Button
          variant="link"
          className="text-decoration-none text-dark d-flex align-items-center p-0 me-2"
          onClick={() => navigate("/admin/customer-group")}
        >
          <i className="bi bi-arrow-left me-2"></i> Quay lại
        </Button>
        
      </div>

  
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Tên nhóm <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên nhóm khách hàng"
              name="tenNhom"
              value={formData.tenNhom}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập mô tả nhóm khách hàng"
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select
              name="trangThai"
              value={formData.trangThai}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  trangThai: e.target.value === "true",
                })
              }
            >
              <option value="true">Hoạt động</option>
              <option value="false">Ngưng hoạt động</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </Button>

            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Đang lưu...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

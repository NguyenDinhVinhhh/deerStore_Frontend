import React, { useState } from "react";
import { Button, Modal, Form, Table, Spinner } from "react-bootstrap";
import branchApi from "../../../services/branchApi";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import { useBranch } from "../../../hooks/use-branchs";

export default function Branch({ onBack }) {
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const { data: branches, isLoading: loading } = useBranch();
  const [formData, setFormData] = useState({
    tenChiNhanh: "",
    diaChi: "",
    sdt: "",
    nguoiQuanLy: "",
  });
  console.log(branches);
  // Mở modal thêm/sửa
  const handleShowModal = (branch = null) => {
    setEditingBranch(branch);
    setFormData(
      branch
        ? {
            tenChiNhanh: branch.tenChiNhanh,
            diaChi: branch.diaChi,
            sdt: branch.sdt,
            nguoiQuanLy: branch.nguoiQuanLy,
          }
        : { tenChiNhanh: "", diaChi: "", sdt: "", nguoiQuanLy: "" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBranch(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validate dữ liệu
  const validateForm = () => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.tenChiNhanh.trim()) {
      Swal.fire("Cảnh báo", "Tên chi nhánh không được để trống!", "warning");
      return false;
    }
    if (!formData.diaChi.trim()) {
      Swal.fire("Cảnh báo", "Địa chỉ không được để trống!", "warning");
      return false;
    }
    if (!phoneRegex.test(formData.sdt)) {
      Swal.fire("Cảnh báo", "Số điện thoại phải gồm 10 chữ số!", "warning");
      return false;
    }
    if (!formData.nguoiQuanLy.trim()) {
      Swal.fire("Cảnh báo", "Người quản lý không được để trống!", "warning");
      return false;
    }
    return true;
  };

  // ✅ Thêm / Sửa chi nhánh
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingBranch) {
        await branchApi.update(editingBranch.maChiNhanh, formData);
        Swal.fire("Thành công", "Cập nhật chi nhánh thành công!", "success");
      } else {
        await branchApi.create(formData);
        Swal.fire("Thành công", "Thêm chi nhánh thành công!", "success");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu chi nhánh:", error);
      Swal.fire("Lỗi!", "Không thể lưu chi nhánh.", "error");
    }
  };

  // ✅ Xóa chi nhánh
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa chi nhánh này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await branchApi.delete(id);
        Swal.fire("Đã xóa!", "Chi nhánh đã được xóa.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa chi nhánh:", error);
        if (error.response && error.response.status === 409) {
          Swal.fire(
            "Không thể xóa!",
            "Chi nhánh này đang được sử dụng ở nơi khác.",
            "error"
          );
        } else {
          Swal.fire("Lỗi!", "Không thể xóa chi nhánh.", "error");
        }
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-light border" onClick={onBack}>
          <FaArrowLeft className="me-2" /> Quay lại
        </button>
        <h3 className="fw-bold">Danh sách chi nhánh</h3>
        <Button variant="primary" onClick={() => handleShowModal()}>
          + Thêm chi nhánh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr className="text-center">
              <th className="text-white">#</th>
              <th className="text-white">Tên chi nhánh</th>
              <th className="text-white">Địa chỉ</th>
              <th className="text-white">Số điện thoại</th>
              <th className="text-white">Người quản lý</th>
              <th className="text-white">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {branches.length > 0 ? (
              branches.map((branch, index) => (
                <tr key={branch.maChiNhanh}>
                  <td className="text-center">{index + 1}</td>
                  <td>{branch.tenChiNhanh}</td>
                  <td>{branch.diaChi}</td>
                  <td>{branch.sdt}</td>
                  <td>{branch.nguoiQuanLy}</td>
                  <td className="text-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(branch)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(branch.maChiNhanh)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Không có chi nhánh nào.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingBranch ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên chi nhánh</Form.Label>
              <Form.Control
                type="text"
                name="tenChiNhanh"
                value={formData.tenChiNhanh}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="sdt"
                value={formData.sdt}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Người quản lý</Form.Label>
              <Form.Control
                type="text"
                name="nguoiQuanLy"
                value={formData.nguoiQuanLy}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="text-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="me-2"
              >
                Hủy
              </Button>
              <Button variant="secondary" type="submit">
                {editingBranch ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

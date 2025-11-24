import React, { useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import categoryApi from "../../../services/categoryApi";
import { FaArrowLeft } from "react-icons/fa";
import { useCategory } from "../../../hooks/use-category";

function Category({ onBack }) {
  const {
    data: categories = [],
    isLoading: loadingCategory,
    isError,
    error,
    refetch: refetchCategories,
  } = useCategory();

  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Mở modal thêm/sửa
  const handleOpenModal = (category = null) => {
    setEditCategory(category);
    if (category) {
      reset({
        tenDanhMuc: category.tenDanhMuc,
        moTa: category.moTa,
      });
    } else {
      reset({
        tenDanhMuc: "",
        moTa: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditCategory(null);
  };

  // Thêm hoặc sửa danh mục
  const onSubmit = async (data) => {
    try {
      if (editCategory) {
        await categoryApi.update(editCategory.maDanhMuc, data);
      } else {
        await categoryApi.create(data);
      }

      // 3. Thay thế fetchCategories() bằng refetchCategories()
      refetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi thêm/sửa danh mục:", error);
      alert("Lỗi khi lưu danh mục. Vui lòng kiểm tra console.");
    }
  };

  // Xử lý trạng thái Loading và Error
  if (loadingCategory) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-2">Đang tải danh sách Danh Mục...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-5">
        <Alert variant="danger">
          Lỗi khi tải dữ liệu Danh Mục: {error.message}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button className="btn btn-light border" onClick={onBack}>
          <FaArrowLeft className="me-2" /> Quay lại
        </button>
        <h2 className="text-center flex-grow-1 m-0">Quản lý Danh Mục</h2>
        <Button onClick={() => handleOpenModal()} variant="primary">
          Thêm Danh Mục
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã Danh Mục</th>
            <th>Tên Danh Mục</th>
            <th>Mô Tả</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                Không có danh mục nào.
              </td>
            </tr>
          ) : (
            categories.map((c) => (
              <tr key={c.maDanhMuc}>
                <td>{c.maDanhMuc}</td>
                <td>{c.tenDanhMuc}</td>
                <td>{c.moTa || "—"}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleOpenModal(c)}
                  >
                    Sửa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal Thêm/Sửa Danh Mục */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editCategory ? "Sửa Danh Mục" : "Thêm Danh Mục"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-2">
              <Form.Label>Tên Danh Mục</Form.Label>
              <Form.Control
                type="text"
                {...register("tenDanhMuc", {
                  required: "Tên danh mục là bắt buộc",
                })}
              />
              {errors.tenDanhMuc && (
                <span className="text-danger">{errors.tenDanhMuc.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control type="text" {...register("moTa")} />
            </Form.Group>

            <Button variant="primary" type="submit">
              {editCategory ? "Cập nhật" : "Thêm Danh Mục"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Category;

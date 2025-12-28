import React, { useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import categoryApi from "../../../services/categoryApi";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { useCategory } from "../../../hooks/use-category";
import { toast } from "react-toastify"; // Nên dùng toast để báo lỗi rõ ràng

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
  const [isSubmitting, setIsSubmitting] = useState(false); // Theo dõi trạng thái gửi tin

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpenModal = (category = null) => {
    setEditCategory(category);
    reset({
      tenDanhMuc: category ? category.tenDanhMuc : "",
      moTa: category ? category.moTa : "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditCategory(null);
    setIsSubmitting(false);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editCategory) {
        // SỬA: Đảm bảo editCategory.maDanhMuc có giá trị
        await categoryApi.update(editCategory.maDanhMuc, data);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        // THÊM
        await categoryApi.create(data);
        toast.success("Thêm danh mục thành công!");
      }

      await refetchCategories(); // Chờ refetch xong mới đóng modal
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi API:", error);
      const msg = error.response?.data?.message || "Lỗi khi lưu dữ liệu";
      alert(msg); // Kiểm tra xem có phải lỗi 403 không
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCategory)
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  if (isError)
    return (
      <Alert variant="danger" className="m-5">
        Lỗi: {error.message}
      </Alert>
    );

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="light" className="border me-3" onClick={onBack}>
          <FaArrowLeft />
        </Button>
        <h2 className="mb-0 flex-grow-1">Quản lý Danh Mục</h2>
        <Button onClick={() => handleOpenModal()} variant="primary">
          <FaPlus className="me-2" />
          Thêm mới
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên Danh Mục</th>
            <th>Mô Tả</th>
            <th className="text-center">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.maDanhMuc}>
              <td>{c.maDanhMuc}</td>
              <td className="fw-bold">{c.tenDanhMuc}</td>
              <td>{c.moTa || "—"}</td>
              <td className="text-center">
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleOpenModal(c)}
                >
                  <FaEdit /> Sửa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên Danh Mục</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!!errors.tenDanhMuc}
                {...register("tenDanhMuc", {
                  required: "Vui lòng nhập tên danh mục",
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.tenDanhMuc?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control as="textarea" rows={3} {...register("moTa")} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" className="me-2" /> : null}
              {editCategory ? "Lưu thay đổi" : "Tạo danh mục"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Category;

import React, { useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import khohangApi from "../../../services/warehouseApi";
import { FaArrowLeft } from "react-icons/fa";

// Import các hooks React Query
import { useWarehouse } from "../../../hooks/use-warehouse";
import { useBranch } from "../../../hooks/use-branchs"; // Đã thêm hook Chi Nhánh

function KhoHang({ onBack }) {
  // Lấy dữ liệu Kho Hàng
  const {
    data: khoHangList = [],
    isLoading: loadingKho,
    isError: isErrorKho,
    error: errorKho,
    refetch: refetchKhoHang,
  } = useWarehouse();

  // Lấy dữ liệu Chi Nhánh (thay thế logic useEffect/useState cũ)
  const {
    data: chiNhanhList = [],
    isLoading: loadingBranch,
    isError: isErrorBranch,
  } = useBranch();

  const [showModal, setShowModal] = useState(false);
  const [editKho, setEditKho] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpenModal = (kho = null) => {
    setEditKho(kho);
    if (kho) {
      // Đảm bảo maChiNhanh là String để gán vào select box
      reset({ ...kho, maChiNhanh: String(kho.maChiNhanh) });
    } else {
      reset({ tenKho: "", diaChiKho: "", moTa: "", maChiNhanh: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditKho(null);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        tenKho: data.tenKho,
        diaChiKho: data.diaChiKho,
        moTa: data.moTa,
        // Khi tạo mới, lấy maChiNhanh từ form và chuyển sang Number
        // Khi sửa, maChiNhanh được giữ nguyên từ editKho (không thay đổi)
        maChiNhanh: editKho ? editKho.maChiNhanh : Number(data.maChiNhanh),
      };

      if (editKho) {
        await khohangApi.update(editKho.maKho, payload);
      } else {
        await khohangApi.create(payload);
      }

      // Tự động cập nhật danh sách kho hàng
      refetchKhoHang();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi thêm/sửa kho:", error);
    }
  };

  // Trạng thái Loading và Error tổng
  const isOverallLoading = loadingKho || loadingBranch;

  if (isErrorKho || isErrorBranch) {
    return (
      <Alert variant="danger">
        Lỗi khi tải dữ liệu:{" "}
        {isErrorKho ? errorKho.message : "Lỗi tải chi nhánh."}
      </Alert>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button className="btn btn-light border" onClick={onBack}>
          <FaArrowLeft className="me-2" /> Quay lại
        </button>

        <h2 className="text-center flex-grow-1 m-0">Quản lý Kho Hàng</h2>

        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          // Vô hiệu hóa nếu chưa tải xong chi nhánh
          disabled={!chiNhanhList.length}
        >
          Thêm Kho Hàng
        </Button>
      </div>

      {isOverallLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mã Kho</th>
              <th>Tên Kho</th>
              <th>Địa Chỉ</th>
              <th>Mô Tả</th>
              <th>Chi Nhánh</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {khoHangList.map((kho) => {
              // Tìm tên chi nhánh từ danh sách đã load
              const chiNhanh = chiNhanhList.find(
                (cn) => cn.maChiNhanh === kho.maChiNhanh
              );
              return (
                <tr key={kho.maKho}>
                  <td>{kho.maKho}</td>
                  <td>{kho.tenKho}</td>
                  <td>{kho.diaChiKho}</td>
                  <td>{kho.moTa}</td>
                  {/* Hiển thị tên chi nhánh */}
                  <td>{chiNhanh ? chiNhanh.tenChiNhanh : "Không xác định"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleOpenModal(kho)}
                    >
                      Sửa
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* Modal Thêm/Sửa Kho */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editKho ? "Sửa Kho Hàng" : "Thêm Kho Hàng"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Tên Kho</Form.Label>
              <Form.Control
                type="text"
                {...register("tenKho", { required: "Tên kho là bắt buộc" })}
              />
              {errors.tenKho && (
                <span className="text-danger">{errors.tenKho.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa Chỉ</Form.Label>
              <Form.Control
                type="text"
                {...register("diaChiKho", { required: "Địa chỉ là bắt buộc" })}
              />
              {errors.diaChiKho && (
                <span className="text-danger">{errors.diaChiKho.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control type="text" {...register("moTa")} />
            </Form.Group>

            {!editKho && (
              <Form.Group className="mb-3">
                <Form.Label>Chi Nhánh</Form.Label>
                <Form.Select
                  {...register("maChiNhanh", { required: "Chọn chi nhánh" })}
                  disabled={loadingBranch} // Vô hiệu hóa khi đang tải
                >
                  <option value="">-- Chọn chi nhánh --</option>
                  {/* Sử dụng chiNhanhList từ hook */}
                  {chiNhanhList.map((cn) => (
                    <option key={cn.maChiNhanh} value={cn.maChiNhanh}>
                      {cn.tenChiNhanh}
                    </option>
                  ))}
                </Form.Select>
                {errors.maChiNhanh && (
                  <span className="text-danger">
                    {errors.maChiNhanh.message}
                  </span>
                )}
              </Form.Group>
            )}

            <Button variant="primary" type="submit">
              {editKho ? "Cập Nhật" : "Thêm Kho"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default KhoHang;

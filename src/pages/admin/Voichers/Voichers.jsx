// Voichers.jsx
import React, { useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import khuyenMaiApi from "../../../services/VoichersApi";
import { FaArrowLeft } from "react-icons/fa";

// Import hook useVoicher
import { useVoicher } from "../../../hooks/use-voichers";

function Voichers({ onBack }) {
  // 1. Sử dụng hook useVoicher để lấy dữ liệu
  const {
    data: voichers = [], // Đổi tên biến để rõ ràng hơn: voichersList
    isLoading: loadingVoicher,
    isError,
    error,
    refetch: refetchVoichers, // Lấy hàm refetch
  } = useVoicher();

  // 2. Loại bỏ các state quản lý dữ liệu thủ công:
  // const [voichers, setVoichers] = useState([]);
  // const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editVoicher, setEditVoicher] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 3. Loại bỏ hàm fetchVoichers và useEffect

  // Mở modal thêm/sửa
  const handleOpenModal = (voicher = null) => {
    setEditVoicher(voicher);
    if (voicher) {
      // Sửa: điền dữ liệu vào form
      reset({
        tenKm: voicher.tenKm,
        moTa: voicher.moTa,
        maCode: voicher.maCode,
        loaiKm: voicher.loaiKm,
        // Đảm bảo các giá trị ngày tháng được định dạng đúng cho input type="date"
        giaTri: voicher.giaTri,
        dieuKienApDung: voicher.dieuKienApDung,
        ngayBatDau: voicher.ngayBatDau
          ? new Date(voicher.ngayBatDau).toISOString().substring(0, 10)
          : "",
        ngayKetThuc: voicher.ngayKetThuc
          ? new Date(voicher.ngayKetThuc).toISOString().substring(0, 10)
          : "",
        // Đảm bảo trạng thái là String để gán vào select
        trangThai: String(voicher.trangThai),
      });
    } else {
      reset({
        tenKm: "",
        moTa: "",
        maCode: "",
        loaiKm: "PERCENT",
        giaTri: "",
        dieuKienApDung: "",
        ngayBatDau: "",
        ngayKetThuc: "",
        trangThai: "1", // Mặc định là Hoạt động (String)
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditVoicher(null);
  };

  // Thêm hoặc sửa voicher
  const onSubmit = async (data) => {
    try {
      // Chuyển giá trị trạng thái và giá trị khuyến mãi về dạng số (nếu cần thiết)
      const payload = {
        ...data,
        giaTri: Number(data.giaTri),
        trangThai: Number(data.trangThai),
      };

      if (editVoicher) {
        await khuyenMaiApi.update(editVoicher.maKm, payload);
      } else {
        await khuyenMaiApi.create(payload);
      }

      // 4. Gọi refetchVoichers để cập nhật dữ liệu
      refetchVoichers();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi thêm/sửa voicher:", error);
      alert("Lỗi khi lưu Voicher. Vui lòng kiểm tra console.");
    }
  };

  // Xử lý trạng thái Loading và Error
  if (loadingVoicher) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-2">Đang tải danh sách Voicher...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-5">
        <Alert variant="danger">
          Lỗi khi tải dữ liệu Voicher: {error.message}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        {/* Nút Quay lại bên trái */}
        <button className="btn btn-light border" onClick={onBack}>
          <FaArrowLeft className="me-2" /> Quay lại
        </button>

        {/* Tiêu đề nằm giữa */}
        <h2 className="text-center flex-grow-1 m-0">Quản lý Voicher</h2>

        {/* Nút Thêm Voicher bên phải */}
        <Button onClick={() => handleOpenModal()} variant="primary">
          Thêm Voicher
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Mã Code</th>
            <th>Loại</th>
            <th>Giá trị</th>
            <th>Điều kiện áp dụng</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {voichers.map((v) => (
            <tr key={v.maKm}>
              <td>{v.maKm}</td>
              <td>{v.tenKm}</td>
              <td>{v.maCode}</td>
              <td>
                <span
                  className={`badge ${
                    v.loaiKm === "PERCENT" ? "bg-info" : "bg-primary"
                  }`}
                >
                  {v.loaiKm === "PERCENT" ? "Phần trăm" : "Tiền"}
                </span>
              </td>
              <td>{v.giaTri}</td>
              <td>{v.dieuKienApDung || "Không"}</td>
              {/* Hiển thị ngày tháng */}
              <td>
                {v.ngayBatDau
                  ? new Date(v.ngayBatDau).toLocaleDateString()
                  : "—"}
              </td>
              <td>
                {v.ngayKetThuc
                  ? new Date(v.ngayKetThuc).toLocaleDateString()
                  : "—"}
              </td>
              <td>
                <span
                  className={`badge ${
                    v.trangThai === 1 ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {v.trangThai === 1 ? "Hoạt động" : "Ngừng hoạt động"}
                </span>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleOpenModal(v)}
                >
                  Sửa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Thêm/Sửa Voicher */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editVoicher ? "Sửa Voicher" : "Thêm Voicher"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Các trường form giữ nguyên */}
            <Form.Group className="mb-2">
              <Form.Label>Tên Voicher</Form.Label>
              <Form.Control
                type="text"
                {...register("tenKm", { required: "Tên voicher là bắt buộc" })}
              />
              {errors.tenKm && (
                <span className="text-danger">{errors.tenKm.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control type="text" {...register("moTa")} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Mã Code</Form.Label>
              <Form.Control
                type="text"
                {...register("maCode", { required: "Mã code là bắt buộc" })}
              />
              {errors.maCode && (
                <span className="text-danger">{errors.maCode.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Loại Khuyến mãi</Form.Label>
              <Form.Select {...register("loaiKm", { required: true })}>
                <option value="PERCENT">Phần trăm</option>
                <option value="FIXED">Tiền</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Giá trị</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                {...register("giaTri", {
                  required: "Giá trị là bắt buộc",
                  valueAsNumber: true,
                })}
              />
              {errors.giaTri && (
                <span className="text-danger">{errors.giaTri.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Điều kiện áp dụng</Form.Label>
              <Form.Control type="text" {...register("dieuKienApDung")} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Ngày bắt đầu</Form.Label>
              <Form.Control type="date" {...register("ngayBatDau")} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Ngày kết thúc</Form.Label>
              <Form.Control type="date" {...register("ngayKetThuc")} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              {/* Cập nhật value để khớp với cách bạn sử dụng: 1 và 0 (String) */}
              <Form.Select {...register("trangThai")}>
                <option value="1">Hoạt động</option>
                <option value="0">Ngừng hoạt động</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              {editVoicher ? "Cập nhật" : "Thêm Voicher"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Voichers;

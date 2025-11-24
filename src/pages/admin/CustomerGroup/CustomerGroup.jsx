import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import customerGroupApi from "../../../services/customerGroupApi";

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

function CustomerGroup() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editGroup, setEditGroup] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await customerGroupApi.getAll();
      setGroups(res.data);
    } catch (error) {
      console.error("Lỗi lấy nhóm khách hàng:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      const nguongA = a.nguongChiTieuToiThieu || 0;
      const nguongB = b.nguongChiTieuToiThieu || 0;
      return nguongA - nguongB;
    });
  }, [groups]);

  // SỬA: Thêm trường maxCap vào reset
  const handleOpenModal = (group = null) => {
    setEditGroup(group);
    if (group) {
      reset({
        tenNhom: group.tenNhom,
        chietKhau: group.phanTramChietKhau,
        dieuKien: group.nguongChiTieuToiThieu,
        moTa: group.moTa,
        trangThai: group.trangThai,
        // 💡 BỔ SUNG: Lấy giới hạn tiền giảm
        maxCap: group.gioiHanTienGiamToiDa || 0,
      });
    } else {
      reset({
        tenNhom: "",
        chietKhau: "",
        dieuKien: 0,
        moTa: "",
        trangThai: true,
        // 💡 BỔ SUNG: Giá trị mặc định khi thêm mới
        maxCap: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditGroup(null);
  };

  // SỬA: Thêm trường gioiHanTienGiamToiDa vào payload
  const onSubmit = async (data) => {
    const payload = {
      tenNhom: data.tenNhom,
      moTa: data.moTa,
      trangThai: Boolean(data.trangThai),
      phanTramChietKhau: parseFloat(data.chietKhau) || 0,
      nguongChiTieuToiThieu: parseFloat(data.dieuKien) || 0,
      // 💡 BỔ SUNG: Gửi Max Cap lên Backend
      gioiHanTienGiamToiDa: parseFloat(data.maxCap) || 0,
    };

    try {
      if (editGroup) {
        await customerGroupApi.update(editGroup.maNhom, payload);
      } else {
        await customerGroupApi.add(payload);
      }
      fetchGroups();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi thêm/sửa nhóm khách hàng:", error);
      alert(
        "Thêm/sửa nhóm khách hàng thất bại. Kiểm tra token hoặc quyền truy cập!"
      );
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="text-center flex-grow-1 m-0">Quản lý Hạng thành viên</h2>
        <Button onClick={() => handleOpenModal()} variant="primary">
          Thêm Nhóm
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mã Nhóm</th>
              <th>Tên Hạng</th>
              <th>Chiết Khấu (%)</th>
              <th>Điều Kiện Áp Dụng (Chi tiêu tối thiểu)</th>
              {/* 💡 BỔ SUNG: Cột hiển thị Max Cap */}
              <th>Giảm tối đa (VND)</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {/* Sử dụng danh sách đã sắp xếp: sortedGroups */}
            {sortedGroups.map((g) => (
              <tr key={g.maNhom}>
                <td>{g.maNhom}</td>
                <td>{g.tenNhom}</td>
                {/* Hiển thị chiết khấu với 2 chữ số thập phân */}
                <td>
                  {g.phanTramChietKhau
                    ? g.phanTramChietKhau.toFixed(2)
                    : "0.00"}
                </td>

                {/* Áp dụng định dạng tiền tệ cho Ngưỡng chi tiêu */}
                <td>{formatCurrency(g.nguongChiTieuToiThieu)}</td>

                {/* 💡 BỔ SUNG: Hiển thị Giới hạn tiền giảm */}
                <td>{formatCurrency(g.gioiHanTienGiamToiDa)}</td>

                <td>{g.trangThai ? "Hoạt động" : "Ngừng hoạt động"}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleOpenModal(g)}
                  >
                    Sửa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editGroup ? "Sửa Hạng thành viên" : "Thêm Hạng thành viên"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Tên Nhóm */}
            <Form.Group className="mb-2">
              <Form.Label>Tên Nhóm</Form.Label>
              <Form.Control
                type="text"
                {...register("tenNhom", { required: "Tên nhóm là bắt buộc" })}
              />
              {errors.tenNhom && (
                <span className="text-danger">{errors.tenNhom.message}</span>
              )}
            </Form.Group>

            {/* Chiết Khấu (%) */}
            <Form.Group className="mb-2">
              <Form.Label>Chiết Khấu (%)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                {...register("chietKhau", {
                  required: "Chiết khấu là bắt buộc",
                })}
              />
              {errors.chietKhau && (
                <span className="text-danger">{errors.chietKhau.message}</span>
              )}
            </Form.Group>

            {/* Điều Kiện Áp Dụng */}
            <Form.Group className="mb-2">
              <Form.Label>
                Điều Kiện Áp Dụng (Chi tiêu tối thiểu VND)
              </Form.Label>
              <Form.Control type="number" step="1" {...register("dieuKien")} />
            </Form.Group>

            {/* 💡 BỔ SUNG: Giới hạn tiền giảm tối đa (Max Cap) */}
            <Form.Group className="mb-2">
              <Form.Label>Giới Hạn Tiền Giảm Tối Đa (Max Cap VND)</Form.Label>
              <Form.Control
                type="number"
                step="1"
                {...register("maxCap")} // Tên trường trong form là 'maxCap'
              />
            </Form.Group>

            {/* Mô Tả */}
            <Form.Group className="mb-3">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control type="text" {...register("moTa")} />
            </Form.Group>

            {/* Trạng Thái */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Hoạt động"
                {...register("trangThai")}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {editGroup ? "Cập nhật" : "Thêm Nhóm"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CustomerGroup;

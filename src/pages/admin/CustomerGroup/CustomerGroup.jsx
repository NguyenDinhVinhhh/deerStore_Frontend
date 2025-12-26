import React, { useState } from "react";
import { Table, Button, Form, Spinner, Row, Col, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useCustomerGroup } from "../../../hooks/useCustomerGroup";
import customerGroupApi from "../../../services/customerGroupApi";
import { formatVND, formatPercent } from "../../../utils/formatUtils";
import { FaChevronLeft } from "react-icons/fa";
import Swal from "sweetalert2";

export default function CustomerGroup() {
  const [view, setView] = useState("list");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { data: groups, isLoading, refetch } = useCustomerGroup();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleEdit = (group = null) => {
    setSelectedGroup(group);
    if (group) {
      reset({
        tenNhom: group.tenNhom,
        maNhom: group.maNhom,
        moTa: group.moTa,
        phanTramChietKhau: group.phanTramChietKhau,
        nguongChiTieuToiThieu: group.nguongChiTieuToiThieu,
        gioiHanTienGiamToiDa: group.gioiHanTienGiamToiDa,
      });
    } else {
      reset({
        tenNhom: "",
        maNhom: "",
        moTa: "",
        phanTramChietKhau: 0,
        nguongChiTieuToiThieu: 0,
        gioiHanTienGiamToiDa: 0,
      });
    }
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedGroup(null);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        phanTramChietKhau: parseFloat(data.phanTramChietKhau),
        nguongChiTieuToiThieu: parseInt(data.nguongChiTieuToiThieu),
        gioiHanTienGiamToiDa: parseInt(data.gioiHanTienGiamToiDa),
        trangThai: 1,
      };

      if (selectedGroup) {
        await customerGroupApi.update(selectedGroup.maNhom, payload);
        Swal.fire("Thành công", "Đã cập nhật hạng thành viên", "success");
      } else {
        await customerGroupApi.create(payload);
        Swal.fire("Thành công", "Đã thêm hạng thành viên", "success");
      }
      refetch();
      handleBack();
    } catch (error) {
      Swal.fire("Lỗi", "Thao tác thất bại", "error");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn không thể khôi phục sau khi xóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await customerGroupApi.delete(selectedGroup.maNhom);
        Swal.fire("Đã xóa", "Hạng thành viên đã được xóa", "success");
        refetch();
        handleBack();
      } catch (error) {
        Swal.fire("Lỗi", "Không thể xóa hạng thành viên này", "error");
      }
    }
  };

  if (view === "list") {
    return (
      <div className="p-4 bg-light min-vh-100">
        <div className="d-flex justify-content-end mb-4">
          <Button variant="primary" onClick={() => handleEdit()}>
            + Thêm hạng thành viên
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Tên hạng</th>

                  <th className="text-center">Chiết khấu</th>
                  <th>Ngưỡng chi tiêu</th>
                  <th>Giảm tối đa</th>
                </tr>
              </thead>
              <tbody>
                {groups?.map((g, i) => (
                  <tr
                    key={g.maNhom || i}
                    onClick={() => handleEdit(g)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="fw-bold text-dark">{g.tenNhom}</td>

                    <td className="text-center">
                      {formatPercent(g.phanTramChietKhau)}
                    </td>
                    <td>{formatVND(g.nguongChiTieuToiThieu)}</td>
                    <td>{formatVND(g.gioiHanTienGiamToiDa)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom shadow-sm">
        <div
          onClick={handleBack}
          style={{ cursor: "pointer", color: "#6c757d" }}
          className="d-flex align-items-center"
        >
          <FaChevronLeft className="me-2" />
          <span>Quay lại danh sách nhóm khách hàng</span>
        </div>
        <div>
          {selectedGroup && (
            <Button
              variant="outline-danger"
              className="me-2 px-4"
              onClick={handleDelete}
            >
              Xóa
            </Button>
          )}
          <Button
            variant="primary"
            className="px-4"
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </Button>
        </div>
      </div>

      <Form className="p-4">
        <Row>
          <Col md={6}>
            <Card className="border-0 shadow-sm p-3 mb-4">
              <h5 className="fw-bold mb-4">Thông tin chung</h5>

              <Form.Group className="mb-3">
                <Form.Label>
                  Tên hạng <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...register("tenNhom", { required: "Không được để trống" })}
                  isInvalid={!!errors.tenNhom}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả </Form.Label>
                <Form.Control as="textarea" rows={4} {...register("moTa")} />
              </Form.Group>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm p-3 mb-4">
              <h5 className="fw-bold mb-4">Cài đặt nâng cao</h5>

              <Form.Group className="mb-3">
                <Form.Label className="text-muted">
                  Ngưỡng chi tiêu tối thiểu (VND)
                </Form.Label>
                <Form.Control
                  type="number"
                  {...register("nguongChiTieuToiThieu")}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Chiết khấu (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  {...register("phanTramChietKhau")}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-muted">
                  Giới hạn giảm tối đa (VND)
                </Form.Label>
                <Form.Control
                  type="number"
                  {...register("gioiHanTienGiamToiDa")}
                />
              </Form.Group>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

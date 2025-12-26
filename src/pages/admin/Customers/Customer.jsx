import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Spinner,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useCustomer } from "../../../hooks/use-customer";
import khachHangApi from "../../../services/customersApi"; // Đảm bảo đúng file service
import { formatVND } from "../../../utils/formatUtils";
import { FaChevronLeft, FaUserCircle, FaSearch, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

export default function CustomerList() {
  const [view, setView] = useState("list");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Xử lý Debounce cho ô tìm kiếm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: customers = [],
    isLoading,
    refetch,
  } = useCustomer(debouncedSearch);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleEdit = (customer = null) => {
    setSelectedCustomer(customer);
    if (customer) {
      reset({
        hoTen: customer.hoTen,
        sdt: customer.sdt,
        email: customer.email || "",
        diaChi: customer.diaChi || "",
        ghiChu: customer.ghiChu || "",
      });
    } else {
      reset({ hoTen: "", sdt: "", email: "", diaChi: "", ghiChu: "" });
    }
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedCustomer(null);
  };

  const onSubmit = async (data) => {
    try {
      // Khớp chính xác với cấu trúc JSON trong ảnh Postman của bạn
      const payload = {
        hoTen: data.hoTen,
        sdt: data.sdt,
        email: data.email || null,
        diaChi: data.diaChi || null,
        ghiChu: data.ghiChu || null,
      };

      if (selectedCustomer) {
        // Cập nhật khách hàng hiện tại
        await khachHangApi.update(selectedCustomer.maKh, payload);
        Swal.fire("Thành công", "Cập nhật khách hàng thành công", "success");
      } else {
        // Thêm khách hàng mới dựa trên POST http://localhost:8080/api/khach-hang
        await khachHangApi.create(payload);
        Swal.fire("Thành công", "Thêm khách hàng thành công", "success");
      }

      refetch();
      handleBack();
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      Swal.fire(
        "Lỗi",
        error.response?.data?.message ||
          "Thao tác thất bại. Vui lòng kiểm tra lại dữ liệu.",
        "error"
      );
    }
  };

  // Giao diện Danh sách
  if (view === "list") {
    return (
      <div className="p-4 bg-light min-vh-100">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <InputGroup style={{ maxWidth: "400px" }} className="shadow-sm">
            <InputGroup.Text className="bg-white border-end-0 text-muted">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm theo tên hoặc số điện thoại..."
              className="border-start-0 ps-0 shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                className="border-start-0 text-muted bg-white shadow-none"
                onClick={() => setSearchTerm("")}
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>

          <Button
            variant="primary"
            onClick={() => handleEdit()}
            className="px-4 fw-bold shadow-sm"
          >
            + Thêm khách hàng
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Card className="border-0 shadow-sm overflow-hidden">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Hạng thành viên</th>
                  <th className="text-end">Tổng chi tiêu</th>
                  <th className="text-center pe-4">Số đơn hàng</th>
                </tr>
              </thead>
              <tbody>
                {customers && customers.length > 0 ? (
                  customers.map((c) => (
                    <tr
                      key={c.maKh}
                      onClick={() => handleEdit(c)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{c.hoTen}</div>
                        <small className="text-muted">{c.email || "---"}</small>
                      </td>
                      <td>{c.sdt}</td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                          {c.tenNhom || "Thành viên Mới"}
                        </span>
                      </td>
                      <td className="text-end fw-bold">
                        {formatVND(c.tongChiTieuLuyKe || 0)}
                      </td>
                      <td className="text-center pe-4">
                        {c.tongSoDonHang || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      {searchTerm
                        ? `Không tìm thấy khách hàng nào khớp với "${searchTerm}"`
                        : "Chưa có dữ liệu khách hàng"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        )}
      </div>
    );
  }

  // Giao diện Chỉnh sửa/Thêm mới
  return (
    <div className="bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom shadow-sm">
        <div
          onClick={handleBack}
          style={{ cursor: "pointer" }}
          className="d-flex align-items-center text-secondary fw-medium"
        >
          <FaChevronLeft className="me-2" />
          <span>Quay lại danh sách khách hàng</span>
        </div>
        <Button
          variant="primary"
          className="px-4 fw-bold shadow-sm"
          onClick={handleSubmit(onSubmit)}
        >
          {selectedCustomer ? "Cập nhật khách hàng" : "Lưu khách hàng"}
        </Button>
      </div>

      <Form className="p-4">
        <Row>
          {/* Cột trái: Thông tin chính */}
          <Col md={7}>
            <Card className="border-0 shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-4">Thông tin chung</h5>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">
                  Họ tên khách hàng <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...register("hoTen", { required: "Vui lòng nhập họ tên" })}
                  isInvalid={!!errors.hoTen}
                  placeholder="Nhập họ và tên khách hàng"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.hoTen?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      Số điện thoại <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      {...register("sdt", {
                        required: "Vui lòng nhập SĐT",
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: "SĐT không hợp lệ",
                        },
                      })}
                      isInvalid={!!errors.sdt}
                      placeholder="0912345678"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sdt?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Email</Form.Label>
                    <Form.Control
                      {...register("email")}
                      type="email"
                      placeholder="nguyenvanan@gmail.com"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Địa chỉ</Form.Label>
                <Form.Control
                  {...register("diaChi")}
                  placeholder="Quận 10, TP. Hồ Chí Minh"
                />
              </Form.Group>
            </Card>
          </Col>

          {/* Cột phải: Thống kê & Ghi chú */}
          <Col md={5}>
            {selectedCustomer && (
              <Card className="border-0 shadow-sm p-4 mb-4 bg-primary text-white text-center shadow-sm">
                <FaUserCircle size={60} className="mb-3" />
                <h5 className="mb-1 fw-bold">
                  {selectedCustomer.tenNhom || "Thành viên Mới"}
                </h5>
                <div className="small opacity-75">Hạng thành viên hiện tại</div>
                <hr className="my-3 border-white opacity-25" />
                <div className="d-flex justify-content-around">
                  <div>
                    <div className="h4 mb-0 fw-bold">
                      {selectedCustomer.tongSoDonHang || 0}
                    </div>
                    <div className="small opacity-75">Đơn hàng</div>
                  </div>
                  <div className="border-end border-white opacity-25"></div>
                  <div>
                    <div className="h4 mb-0 fw-bold">
                      {formatVND(selectedCustomer.tongChiTieuLuyKe || 0)}
                    </div>
                    <div className="small opacity-75">Đã chi tiêu</div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">Ghi chú khách hàng</h5>
              <Form.Control
                as="textarea"
                rows={5}
                {...register("ghiChu")}
                placeholder="Ví dụ: Khách mua lần đầu, khách ưu tiên..."
                className="shadow-none"
              />
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import loginApi from "../../services/LoginCustomerApi";
import { toast } from "react-toastify";
import { FaUserPlus, FaUser, FaLock, FaPhone, FaIdCard } from "react-icons/fa";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      // Gửi dữ liệu theo đúng cấu trúc JSON yêu cầu
      const payload = {
        sdt: data.sdt,
        matKhau: data.matKhau,
        hoTen: data.hoTen,
        tenDangNhap: data.tenDangNhap,
      };

      const response = await loginApi.registerCustomer(payload);

      toast.success(response.message || "Đăng ký thành công!");

      // Chuyển hướng sau khi thành công
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      // Hiển thị lỗi từ RuntimeException của Backend
      setError(err.response?.data || "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center my-5"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100">
        <Col md={8} lg={5} className="mx-auto">
          <Card
            className="border-0 shadow-lg p-4"
            style={{ borderRadius: "15px" }}
          >
            <Card.Body>
              <div className="text-center mb-4">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: "60px", height: "60px" }}
                >
                  <FaUserPlus size={30} />
                </div>
                <h3 className="fw-bold text-dark">ĐĂNG KÝ THÀNH VIÊN</h3>
                <p className="text-muted small">
                  Vui lòng điền đầy đủ thông tin bên dưới
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="py-2 small text-center">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Họ tên */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">
                    <FaIdCard className="me-1" /> Họ và tên
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nguyễn Đình Vinh"
                    {...register("hoTen", {
                      required: "Họ tên không được để trống",
                    })}
                    isInvalid={!!errors.hoTen}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hoTen?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Số điện thoại */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">
                    <FaPhone className="me-1" /> Số điện thoại
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="038xxxxxxx"
                    {...register("sdt", {
                      required: "Số điện thoại là bắt buộc",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "SĐT phải gồm 10 chữ số",
                      },
                    })}
                    isInvalid={!!errors.sdt}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sdt?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Tên đăng nhập */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">
                    <FaUser className="me-1" /> Tên đăng nhập
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="quang"
                    {...register("tenDangNhap", {
                      required: "Tên đăng nhập là bắt buộc",
                    })}
                    isInvalid={!!errors.tenDangNhap}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.tenDangNhap?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={12}>
                    {/* Mật khẩu */}
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">
                        <FaLock className="me-1" /> Mật khẩu
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="********"
                        {...register("matKhau", {
                          required: "Mật khẩu là bắt buộc",
                          minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
                        })}
                        isInvalid={!!errors.matKhau}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.matKhau?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-bold py-2 mt-3 mb-3 shadow"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "TẠO TÀI KHOẢN"
                  )}
                </Button>

                <div className="text-center small">
                  <span className="text-muted">Đã có tài khoản? </span>
                  <Link to="/login" className="text-decoration-none fw-bold">
                    Đăng nhập tại đây
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

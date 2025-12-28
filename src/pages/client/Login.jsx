import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import loginApi from "../../services/LoginCustomerApi"; // API Khách hàng
import authApi from "../../services/loginApi"; // API Nhân viên/Quản trị
import roleApi from "../../services/roleApi";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("customer"); // State để biết đang chọn Tab nào
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      let resData;

      if (activeTab === "customer") {
        // 1. Nếu đang ở Tab Khách hàng -> Gọi đúng API khách hàng
        resData = await loginApi.loginCustomer(data);

        localStorage.setItem("token", resData.token);
        localStorage.setItem("user", JSON.stringify(resData));
        localStorage.setItem("userType", "CUSTOMER");

        navigate("/");
        window.location.reload();
      } else {
        // 2. Nếu đang ở Tab Quản trị -> Gọi đúng API nhân viên
        resData = await authApi.login(data);

        localStorage.setItem("token", resData.token);
        localStorage.setItem("user", JSON.stringify(resData));
        localStorage.setItem("userType", "ADMIN");
        localStorage.setItem(
          "chiNhanhList",
          JSON.stringify(resData.chiNhanhList)
        );

        if (resData.maVaiTro) {
          const permissions = await roleApi.getPermissions(resData.maVaiTro);
          localStorage.setItem("permissions", JSON.stringify(permissions));
        }
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      // Backend trả về chuỗi thông báo lỗi trực tiếp
      setError(err.response?.data || "Thông tin đăng nhập không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "85vh" }}
    >
      <Row className="w-100">
        <Col
          md={6}
          lg={5}
          className="mx-auto p-4 bg-white rounded shadow border"
        >
          <h3 className="text-center mb-4 fw-bold">Đăng nhập</h3>

          {error && (
            <Alert variant="danger" className="py-2 small text-center">
              {error}
            </Alert>
          )}

          {/* Chia Tab để hệ thống biết chính xác vai trò khi submit */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k);
              setError("");
            }}
            className="mb-4"
            justify
          >
            <Tab eventKey="customer" title="KHÁCH HÀNG" />
            <Tab eventKey="admin" title="QUẢN TRỊ" />
          </Tabs>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  activeTab === "customer"
                    ? "Nhập tên đăng nhập"
                    : "Tài khoản nhân viên"
                }
                {...register("tenDangNhap", {
                  required: "Vui lòng nhập tên đăng nhập",
                })}
                isInvalid={!!errors.tenDangNhap}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                {...register("matKhau", { required: "Vui lòng nhập mật khẩu" })}
                isInvalid={!!errors.matKhau}
              />
            </Form.Group>

            <Button
              variant={activeTab === "customer" ? "primary" : "danger"}
              type="submit"
              className="w-100 fw-bold py-2 mb-3"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "ĐĂNG NHẬP"}
            </Button>

            {activeTab === "customer" && (
              <div className="text-center small">
                <span className="text-muted">Chưa có tài khoản? </span>
                <Link to="/register" className="text-decoration-none fw-bold">
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

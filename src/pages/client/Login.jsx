import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import loginApi from "../../services/loginApi";
import roleApi from "../../services/roleApi";

export default function Login() {
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
      const response = await loginApi.login(data);
      const resData = response;
      if (!resData.token) {
        setError("Đăng nhập thất bại, không nhận token!");
        return;
      }

      localStorage.setItem("token", resData.token);
      localStorage.setItem("user", JSON.stringify(resData));
      localStorage.setItem(
        "chiNhanhList",
        JSON.stringify(resData.chiNhanhList)
      );
      if (resData.maVaiTro) {
        const permRes = await roleApi.getPermissions(resData.maVaiTro);
        const permissions = permRes;
        localStorage.setItem("permissions", JSON.stringify(permissions));
      }
      navigate("/admin");
    } catch (err) {
      console.error(err.response || err);
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <h3 className="text-center mb-4">Đăng nhập</h3>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đăng nhập hoặc email"
                {...register("tenDangNhap", {
                  required: "Tên đăng nhập là bắt buộc",
                })}
                isInvalid={errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                {...register("matKhau", { required: "Mật khẩu là bắt buộc" })}
                isInvalid={errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Đăng nhập"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

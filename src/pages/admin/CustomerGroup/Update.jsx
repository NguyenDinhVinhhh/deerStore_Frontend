import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Card, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import customerGroupApi from "../../../services/customerGroupApi";

export default function Update() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      tenNhom: "",
      moTa: "",
      trangThai: true,
    },
  });

  // ✅ Lấy dữ liệu nhóm khách hàng khi load trang
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await customerGroupApi.getById(id);
        const data = res.data || res; // tuỳ backend trả về có bọc trong data không

        // Chuẩn hoá dữ liệu để khớp với form
        reset({
          tenNhom: data.tenNhom ?? data.ten_nhom ?? "",
          moTa: data.moTa ?? data.mo_ta ?? "",
          trangThai:
            data.trangThai ?? data.trang_thai ?? true,
        });
      } catch (error) {
        console.error("Lỗi khi tải nhóm:", error);
        alert("Không tải được dữ liệu nhóm khách hàng!");
      }
    };

    fetchGroup();
  }, [id, reset]);

  // ✅ Xử lý khi nhấn "Lưu"
  const onSubmit = async (data) => {
    try {
      await customerGroupApi.update(id, data);
      alert("Cập nhật thành công!");
      navigate("/admin/customer-group");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật nhóm!");
    }
  };

  // ✅ Xử lý xóa
  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc muốn xóa nhóm này không?")) {
      try {
        await customerGroupApi.delete(id);
        alert("Đã xóa nhóm!");
        navigate("/admin/customer-group");
      } catch (error) {
        alert("Lỗi khi xóa nhóm!");
      }
    }
  };

  return (
    <div className="d-flex m-5 vh-85 bg-light">
      <Card className="shadow-lg p-4" style={{ width: "1200px" }}>
        <h4
          className="fw-bold text-center mb-4 text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin/customer-group")}
        >
          ← Cập nhật nhóm khách hàng
        </h4>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>
              Tên nhóm <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên nhóm khách hàng"
              {...register("tenNhom", { required: "Tên nhóm là bắt buộc" })}
            />
            {errors.tenNhom && (
              <small className="text-danger">{errors.tenNhom.message}</small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập mô tả nhóm khách hàng"
              {...register("moTa")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Hoạt động"
              {...register("trangThai")}
            />
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => navigate("/admin/customer-group")}>
              Hủy
            </Button>
            <div className="d-flex gap-2">
              <Button
                variant="danger"
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Xóa
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Lưu"}
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}

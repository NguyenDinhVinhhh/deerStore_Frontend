import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import khachHangApi from "../../services/customersApi";
import { toast } from "react-toastify";

const AddCustomer = ({ show, onClose, onSubmit }) => {
  const [newCustomer, setNewCustomer] = useState({
    hoTen: "",
    sdt: "",
    email: "",
    diaChi: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form mỗi khi mở modal (tuỳ bạn muốn reset lúc mở hay lúc đóng)
  useEffect(() => {
    if (show) {
      setError("");
      setLoading(false);
      setNewCustomer({ hoTen: "", sdt: "", email: "", diaChi: "" });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!newCustomer.hoTen?.trim() || !newCustomer.sdt?.trim()) {
      setError("Vui lòng nhập Tên khách hàng và Số điện thoại.");
      return;
    }

    try {
      setLoading(true);

      // Gọi API tạo khách hàng
      const created = await khachHangApi.create({
        ...newCustomer,
        hoTen: newCustomer.hoTen.trim(),
        sdt: newCustomer.sdt.trim(),
        email: newCustomer.email?.trim() || "",
        diaChi: newCustomer.diaChi?.trim() || "",
      });

      // callback cho parent (để add vào list / reload)
      onSubmit?.(created);
      toast.success("Thêm khách hàng thành công!");
      // đóng modal khi thành công
      onClose?.();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Tạo khách hàng thất bại!");
      toast.error("Lỗi khi thêm khách hàng. Vui lòng kiểm tra số điện thoại có bị trùng không.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={loading ? undefined : onClose} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!loading}>
          <Modal.Title>➕ Thêm mới khách hàng</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error ? <Alert variant="danger" className="mb-3">{error}</Alert> : null}

          <Form.Group className="mb-3">
            <Form.Label>
              Tên khách hàng <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="hoTen"
              placeholder="Nguyễn Văn A"
              value={newCustomer.hoTen}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Số điện thoại <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="tel"
              name="sdt"
              placeholder="0901234567"
              value={newCustomer.sdt}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="email@example.com"
              value={newCustomer.email}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="diaChi"
              placeholder="Nhập địa chỉ khách hàng"
              value={newCustomer.diaChi}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose} disabled={loading}>
            Hủy
          </Button>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Đang lưu...
              </>
            ) : (
              "Lưu khách hàng"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCustomer;

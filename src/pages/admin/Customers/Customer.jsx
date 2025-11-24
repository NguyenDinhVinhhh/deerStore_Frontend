import React, { useState } from "react";
import khachHangApi from "../../../services/customersApi";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Nav,
  InputGroup,
  FormControl,
  Table,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import {
  Search,
  Funnel,
  BoxArrowDown,
  BoxArrowInUp,
  Gear,
} from "react-bootstrap-icons";

import { useCustomer } from "../../../hooks/use-customer";
import { useQueryClient } from "@tanstack/react-query";

const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "0";
  }
  return amount.toLocaleString("vi-VN");
};

function Customer() {
  const queryClient = useQueryClient();

  const {
    data: danhSachKhachHang = [],
    isLoading: loading,
    isError,
    refetch,
  } = useCustomer();
  console.log("a", danhSachKhachHang);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    hoTen: "",
    sdt: "",
    email: "",
    diaChi: "",
  });

  const handleSearch = async () => {
    // Nếu searchTerm rỗng, gọi refetch để tải lại dữ liệu từ cache/API
    if (!searchTerm || searchTerm.trim() === "") {
      refetch();
      return;
    }

    try {
      const responseData = await khachHangApi.search(searchTerm);

      queryClient.setQueryData(["customer"], responseData); // Tạm ghi đè cache
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      await khachHangApi.create(newCustomer);
      handleCloseModal();

      await queryClient.invalidateQueries({ queryKey: ["customer"] });

      alert("Thêm khách hàng thành công!");
    } catch (err) {
      alert(
        "Lỗi khi thêm khách hàng. Vui lòng kiểm tra số điện thoại có bị trùng không."
      );
      console.error("Lỗi tạo khách hàng:", err);
    }
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm === "") {
      refetch();
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewCustomer({ hoTen: "", sdt: "", email: "", diaChi: "" });
  };
  const handleShowModal = () => setShowModal(true);

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="9" className="text-center">
            <Spinner animation="border" size="sm" /> Đang tải dữ liệu...
          </td>
        </tr>
      );
    }

    if (isError) {
      return (
        <tr>
          <td colSpan="9">
            <Alert variant="danger" className="m-0">
              {
                "Không thể tải danh sách khách hàng. Vui lòng kiểm tra Server và Network."
              }
            </Alert>
          </td>
        </tr>
      );
    }

    if (danhSachKhachHang.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center text-muted">
            Không có dữ liệu khách hàng.
          </td>
        </tr>
      );
    }

    return danhSachKhachHang.map((kh) => (
      <tr key={kh.maKh}>
        <td>
          <Form.Check type="checkbox" />
        </td>
        <td>
          <a href="#">{kh.maKh ? `CUZN${kh.maKh}` : "N/A"}</a>
        </td>
        <td>{kh.hoTen}</td>
        <td>{kh.sdt}</td>

        <td>{kh.tenNhom || "Bán lẻ"}</td>

        <td>{formatCurrency(kh.tongChiTieuLuyKe || 0)}</td>

        <td>{kh.tongSoDonHang || 0}</td>
      </tr>
    ));
  };

  return (
    <Container fluid className="mt-3">
      {/* === Header và Nút Thêm === */}
      <Row className="mb-3">
        <Col md={8} className="d-flex align-items-center">
          <Button variant="outline-secondary" size="sm" className="me-2">
            <BoxArrowDown className="me-1" /> Xuất file
          </Button>
          <Button variant="outline-secondary" size="sm">
            <BoxArrowInUp className="me-1" /> Nhập file
          </Button>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="primary" onClick={handleShowModal}>
            + Thêm khách hàng
          </Button>
        </Col>
      </Row>

      {/* === Card chính: Bảng Khách hàng === */}
      <Card>
        <Card.Header>
          <Nav
            variant="tabs"
            defaultActiveKey="#all"
            className="card-header-tabs"
          >
            <Nav.Item>
              <Nav.Link href="#all">Tất cả khách hàng</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#trading">Đang giao dịch</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body>
          {/* Thanh Search và Filter */}
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <FormControl
                  placeholder="Tìm kiếm theo mã khách hàng, tên, SĐT khách hàng"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                />
                <Button variant="outline-secondary" onClick={handleSearch}>
                  Tìm
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <Button variant="outline-secondary" className="me-2">
                <Funnel className="me-1" /> Bộ lọc
              </Button>
              <Button variant="outline-secondary">Lưu bộ lọc</Button>
            </Col>
          </Row>

          {/* Toolbar Bảng */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <Form.Check type="checkbox" label="Chọn tất cả" />
            </div>
            <div>
              <Button variant="link" size="sm" className="p-0">
                <Gear size={20} />
              </Button>
            </div>
          </div>

          {/* Bảng Dữ Liệu */}
          <Table responsive hover size="sm">
            <thead className="bg-light">
              <tr>
                <th>
                  <Form.Check type="checkbox" />
                </th>
                <th>Mã khách hàng</th>
                <th>Tên khách hàng</th>
                <th>Số điện thoại</th>
                <th>Hạng thành viên</th>
                <th>Tổng chi tiêu</th>
                <th>Tổng SL đơn hàng</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Thêm mới Khách hàng (Giữ nguyên) */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới khách hàng</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateCustomer}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formHoTen">
              <Form.Label>Tên khách hàng (*)</Form.Label>
              <Form.Control
                type="text"
                name="hoTen"
                value={newCustomer.hoTen}
                onChange={handleNewCustomerChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSdt">
              <Form.Label>Số điện thoại (*)</Form.Label>
              <Form.Control
                type="text"
                name="sdt"
                value={newCustomer.sdt}
                onChange={handleNewCustomerChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newCustomer.email}
                onChange={handleNewCustomerChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDiaChi">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="diaChi"
                value={newCustomer.diaChi}
                onChange={handleNewCustomerChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Customer;

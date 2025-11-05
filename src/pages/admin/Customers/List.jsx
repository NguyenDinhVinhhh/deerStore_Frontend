// src/pages/KhachHang/List.jsx
import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup, Table, Nav, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import khachHangApi from "../../../services/customersApi";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function List() {
  const [activeTab, setActiveTab] = useState("tatca");
  const [khachHangs, setKhachHangs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // 🔹 Lấy danh sách khách hàng khi load trang
  useEffect(() => {
    fetchKhachHang();
  }, []);

  const fetchKhachHang = async () => {
    try {
      const res = await khachHangApi.getAll();
      console.log("kadshjakh", res);
      setKhachHangs(res);
      
    } catch (err) {
      console.error("Lỗi khi tải danh sách khách hàng:", err);
    }
  };

  // 🔹 Thêm khách hàng mới
  const onSubmit = async (data) => {
    try {
      await khachHangApi.create(data);
      fetchKhachHang(); // load lại danh sách
      reset(); // reset form
      setShowModal(false); // đóng modal
    } catch (err) {
      console.error("Lỗi khi thêm khách hàng:", err);
    }
  };

  return (
    <div className="p-3 bg-light rounded shadow-sm mt-4">
      {/* Thanh công cụ trên cùng */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-3 align-items-center">
          <Button variant="light" className="d-flex align-items-center gap-2 border">
            <i className="bi bi-download"></i>
            <span>Xuất file</span>
          </Button>

          <Button variant="light" className="d-flex align-items-center gap-2 border">
            <i className="bi bi-upload"></i>
            <span>Nhập file</span>
          </Button>
        </div>

        <Button
          variant="primary"
          className="d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Thêm khách hàng</span>
        </Button>
      </div>

      {/* Tabs lọc khách hàng */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav.Item>
          <Nav.Link eventKey="tatca">Tất cả khách hàng</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="vip">Khách hàng VIP</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="banle">Khách hàng bán lẻ</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Thanh tìm kiếm */}
      <div className="d-flex align-items-center gap-2 mt-3">
        <InputGroup>
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo mã, tên, SDT khách hàng"
          />
        </InputGroup>

        <Button variant="light" className="d-flex align-items-center gap-2 border">
          <i className="bi bi-filter"></i>
          <span>Bộ lọc</span>
        </Button>
        <Button variant="secondary" disabled>
          Lưu bộ lọc
        </Button>
      </div>

      {/* Bảng danh sách khách hàng */}
      <div className="mt-3">
        <Table hover bordered responsive>
          <thead className="table-light">
            <tr>
              <th>
                <Form.Check />
              </th>
              <th>Mã KH</th>
              <th>Tên khách hàng</th>
              <th>Số điện thoại</th>
              <th>Nhóm KH</th>
              <th>Công nợ hiện tại</th>
              <th>Tổng chi tiêu</th>
              <th>Tổng SL đơn hàng</th>
            </tr>
          </thead>
          <tbody>
            {khachHangs.length > 0 ? (
              khachHangs.map((item) => (
                <tr key={item.id}>
                  <td><Form.Check /></td>
                  <td>{item.maKh}</td>
                  <td>{item.hoTen}</td>
                  <td>{item.sdt}</td>
                  <td>{item.nhom?.tenNhom || "Chưa phân nhóm"}</td>
                  <td>{item.congNoHienTai || 0}</td>
                  <td>{item.tongChiTieu || 0}</td>
                  <td>{item.tongDonHang || 0}</td>
                </tr>
              ))
            ) : (
              <tr className="text-center text-muted">
                <td colSpan="8">Chưa có dữ liệu khách hàng</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal thêm khách hàng */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Tên khách hàng</Form.Label>
              <Form.Control {...register("tenKhachHang")} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control {...register("soDienThoai")} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nhóm khách hàng</Form.Label>
              <Form.Control {...register("nhomKhachHang")} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Lưu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

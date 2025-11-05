import React from "react";
import { Table, Button, Form } from "react-bootstrap";
import "./ProductList.css";

export default function ProductList() {
  const products = [
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      name: "ROKR Minty Camellia Lamp DIY 3D Flower Night Light",
      category: "Đèn gỗ DIY",
      brand: "ROKR",
      stock: 0,
      available: 0,
      createdAt: "27/10/2025",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      name: "Paris Cathedral 3D Wooden Puzzle TG511",
      category: "Mô hình gỗ",
      brand: "ROKR",
      stock: 4,
      available: 4,
      createdAt: "25/10/2025",
    },
  ];

  return (
    <div className="product-page">
      <div className="product-header d-flex justify-content-between align-items-center">
        <h4>Loại sản phẩm | Compo | Thay đổi</h4>
        <Button variant="primary">+ Thêm sản phẩm</Button>
      </div>

      <div className="product-filters d-flex gap-2 mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên, mã sản phẩm..."
          style={{ width: "300px" }}
        />
        <Form.Select style={{ width: "180px" }}>
          <option>Loại sản phẩm</option>
          <option>Đèn DIY</option>
          <option>Mô hình gỗ</option>
        </Form.Select>
        <Form.Select style={{ width: "180px" }}>
          <option>Thương hiệu</option>
          <option>ROKR</option>
          <option>Rolife</option>
        </Form.Select>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th></th>
            <th>Ảnh</th>
            <th>Sản phẩm</th>
            <th>Loại</th>
            <th>Thương hiệu</th>
            <th>Có thể bán</th>
            <th>Tồn kho</th>
            <th>Ngày khởi tạo</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td>
                <Form.Check type="checkbox" />
              </td>
              <td>
                <img src={item.image} alt={item.name} className="product-img" />
              </td>
              <td className="product-name">{item.name}</td>
              <td>{item.category}</td>
              <td>{item.brand}</td>
              <td>{item.available}</td>
              <td>{item.stock}</td>
              <td>{item.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

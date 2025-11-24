import React from "react";
import { Card, Button } from "react-bootstrap";

export default function ProductCard({ product }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={product.hinhAnhUrl} 
        alt={product.tenSp}      
        style={{ objectFit: "cover", height: "200px" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.tenSp}</Card.Title>
        <Card.Text className="text-danger fw-bold">
          {product.donGia.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </Card.Text>
        <Button variant="primary" className="mt-auto">
          Xem chi tiết
        </Button>
      </Card.Body>
    </Card>
  );
}

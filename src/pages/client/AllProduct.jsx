import React, { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import ProductCard from "../../components/ProductCard";
import { useCategory } from "../../hooks/use-category";
import { useProduct } from "../../hooks/use-product";

export default function AllProduct() {
  const { data: sanPhams = [], isLoading: loading } = useProduct();
  const { data: danhMucs = [] } = useCategory();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? sanPhams
      : sanPhams.filter((p) => p.maDanhMuc === selectedCategory);

  return (
    <Container className="my-4">
      <Row>
        {/* cột danh mục  */}
        <Col md={3} className="mb-4">
          <h5 className="fw-bold mb-3">Danh mục</h5>
          <Nav className="flex-column">
            <Nav.Link
              active={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
              className="text-dark mb-2 border rounded p-2"
            >
              Tất cả
            </Nav.Link>

            {danhMucs.map((cat) => (
              <Nav.Link
                key={cat.maDanhMuc}
                active={selectedCategory === cat.maDanhMuc}
                onClick={() => setSelectedCategory(cat.maDanhMuc)}
                className="text-dark mb-2 border rounded p-2"
              >
                {cat.tenDanhMuc}
              </Nav.Link>
            ))}
          </Nav>
        </Col>

        {/* cột sản phẩm  */}
        <Col md={9}>
          <h5 className="fw-bold mb-3">
            {selectedCategory === "all"
              ? "Tất cả sản phẩm"
              : `Danh mục: ${
                  danhMucs.find((d) => d.maDanhMuc === selectedCategory)
                    ?.tenDanhMuc
                }`}
          </h5>

          {loading && <p>Đang tải sản phẩm...</p>}

          <Row>
            {filteredProducts.map((product) => (
              <Col md={4} className="mb-4" key={product.maSp}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

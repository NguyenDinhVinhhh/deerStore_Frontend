import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Modal,
  Image,
  Badge,
  Spinner,
  Button,
} from "react-bootstrap";
import {
  FaTools,
  FaClock,
  FaStar,
  FaBox,
  FaTimes,
  FaCartPlus,
} from "react-icons/fa";
import ProductCard from "../../components/ProductCard";
import { useCategory } from "../../hooks/use-category";
import { useProduct } from "../../hooks/use-product";

export default function AllProduct() {
  const { data: sanPhams = [], isLoading: loading } = useProduct();
  const { data: danhMucs = [] } = useCategory();

  const [selectedCategory, setSelectedCategory] = useState("all");

  // State quản lý Modal chi tiết giống trang Home
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShowDetail = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProduct(null);
  };

  // Hàm render sao độ khó
  const renderStars = (level) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        color={i < level ? "#ffc107" : "#e4e5e9"}
        className="me-1"
      />
    ));
  };

  const filteredProducts =
    selectedCategory === "all"
      ? sanPhams
      : sanPhams.filter((p) => p.maDanhMuc === selectedCategory);

  return (
    <Container className="my-5">
      <Row>
        {/* CỘT DANH MỤC */}
        <Col md={3} className="mb-4">
          <div className="sticky-top" style={{ top: "20px" }}>
            <h5 className="fw-bold mb-4 border-bottom pb-2">Danh mục</h5>
            <Nav className="flex-column category-nav">
              <Nav.Link
                active={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
                className={`mb-2 border rounded p-2 transition-all ${
                  selectedCategory === "all"
                    ? "bg-primary text-white"
                    : "text-dark bg-light"
                }`}
                style={{ cursor: "pointer" }}
              >
                Tất cả sản phẩm
              </Nav.Link>

              {danhMucs.map((cat) => (
                <Nav.Link
                  key={cat.maDanhMuc}
                  active={selectedCategory === cat.maDanhMuc}
                  onClick={() => setSelectedCategory(cat.maDanhMuc)}
                  className={`mb-2 border rounded p-2 transition-all ${
                    selectedCategory === cat.maDanhMuc
                      ? "bg-primary text-white"
                      : "text-dark bg-light"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  {cat.tenDanhMuc}
                </Nav.Link>
              ))}
            </Nav>
          </div>
        </Col>

        {/* CỘT SẢN PHẨM */}
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0 text-uppercase">
              {selectedCategory === "all"
                ? "Tất cả sản phẩm"
                : `Danh mục: ${
                    danhMucs.find((d) => d.maDanhMuc === selectedCategory)
                      ?.tenDanhMuc
                  }`}
            </h5>
            <Badge bg="secondary" className="px-3 py-2">
              {filteredProducts.length} Sản phẩm
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
            </div>
          ) : (
            <Row className="g-4">
              {filteredProducts.map((product) => (
                <Col
                  md={4}
                  sm={6}
                  className="mb-2"
                  key={product.maSp}
                  onClick={() => handleShowDetail(product)}
                  style={{ cursor: "pointer" }}
                >
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* MODAL CHI TIẾT SẢN PHẨM (POPUP) */}
      <Modal show={showDetail} onHide={handleCloseDetail} size="lg" centered>
        <Modal.Body className="p-0 rounded-3 overflow-hidden border-0 shadow-lg position-relative">
          {/* Nút đóng góc phải */}
          <div
            className="position-absolute end-0 top-0 p-3"
            style={{ zIndex: 10 }}
          >
            <div
              onClick={handleCloseDetail}
              className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center border"
              style={{ width: "32px", height: "32px", cursor: "pointer" }}
            >
              <FaTimes className="text-secondary" />
            </div>
          </div>

          <Row className="g-0">
            {/* CỘT TRÁI: HÌNH ẢNH & THÔNG SỐ */}
            <Col
              md={6}
              className="bg-white p-4 d-flex flex-column align-items-center justify-content-center border-end"
            >
              <div className="mb-4 text-center w-100 p-2 bg-light rounded shadow-inner">
                <Image
                  src={selectedProduct?.hinhAnhUrl}
                  fluid
                  className="rounded"
                  style={{ maxHeight: "350px", objectFit: "contain" }}
                />
              </div>

              {/* Thông số Pieces - Time - Difficulty */}
              <div className="d-flex justify-content-around w-100 border-top pt-4 mt-auto">
                <div className="text-center">
                  <FaTools className="text-muted mb-2" size={20} />
                  <div className="fw-bold text-dark small">
                    {selectedProduct?.soManhGhep || "--"}
                  </div>
                  <div
                    className="text-muted extra-small"
                    style={{ fontSize: "10px" }}
                  >
                    PIECES
                  </div>
                </div>
                <div className="text-center border-start border-end px-4">
                  <FaClock className="text-muted mb-2" size={20} />
                  <div className="fw-bold text-dark small">
                    {selectedProduct?.thoiGianGhep || "--"} h
                  </div>
                  <div
                    className="text-muted extra-small"
                    style={{ fontSize: "10px" }}
                  >
                    TIME
                  </div>
                </div>
                <div className="text-center">
                  <FaStar className="text-muted mb-2" size={20} />
                  <div className="d-flex justify-content-center mb-1">
                    {renderStars(selectedProduct?.doKho || 0)}
                  </div>
                  <div
                    className="text-muted extra-small"
                    style={{ fontSize: "10px" }}
                  >
                    DIFFICULTY
                  </div>
                </div>
              </div>
            </Col>

            {/* CỘT PHẢI: TÊN, MÔ TẢ, TỒN KHO */}
            <Col md={6} className="p-4 bg-white d-flex flex-column">
              <h4 className="fw-bold text-dark mb-2">
                {selectedProduct?.tenSp}
              </h4>
              <p className="small text-muted mb-4 border-bottom pb-2">
                Mã SKU:{" "}
                <span className="fw-bold">{selectedProduct?.maSku}</span>
              </p>

              <div className="mb-4 flex-grow-1">
                <h6 className="fw-bold text-uppercase small text-secondary mb-2">
                  Mô tả chi tiết
                </h6>
                <div
                  className="text-secondary small custom-scrollbar"
                  style={{
                    lineHeight: "1.7",
                    maxHeight: "140px",
                    overflowY: "auto",
                  }}
                >
                  {selectedProduct?.moTa ||
                    "Sản phẩm lắp ráp mô hình tinh tế, phù hợp cho việc trang trí và giáo dục STEM."}
                </div>
              </div>

              {/* Box Tồn kho */}
              <div className="bg-light p-3 rounded-3 d-flex align-items-center mb-4 border shadow-sm">
                <FaBox className="text-primary me-2" size={18} />
                <span className="small fw-bold text-dark">
                  Tồn kho hiện có:
                </span>
                <span className="ms-auto fs-5 fw-bold text-primary">
                  {selectedProduct?.tonKhoTong}
                </span>
              </div>

              <div className="d-grid mt-auto">
                <Button
                  variant="primary"
                  className="fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  <FaCartPlus /> THÊM VÀO GIỎ HÀNG
                </Button>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

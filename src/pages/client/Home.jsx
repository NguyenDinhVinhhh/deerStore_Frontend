import React, { useState } from "react";
import { Modal, Row, Col, Image, Spinner, Button } from "react-bootstrap";
import {
  FaTools,
  FaClock,
  FaStar,
  FaBox,
  FaTimes,
  FaCartPlus,
} from "react-icons/fa";
import Banner from "../../components/client/Banner";
import ProductCard from "../../components/ProductCard";
import Features from "../../components/client/Features";
import TopCategories from "../../components/client/TopCategories";
import { useProduct } from "../../hooks/use-product";
import "./Home.css";

import hinh1 from "../../assets/imgs/image copy 5.png";
import hinh2 from "../../assets/imgs/image copy 6.png";
import hinh3 from "../../assets/imgs/image copy 7.png";
import hinh4 from "../../assets/imgs/image copy 8.png";
import hinh5 from "../../assets/imgs/image copy 9.png";
import hinh6 from "../../assets/imgs/image copy 10.png";

function Home() {
  const { data: sanPhams, isLoading: loading, isError } = useProduct();
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    { img: hinh1, title: "DIY Book Nook" },
    { img: hinh2, title: "DIY Miniature House" },
    { img: hinh3, title: "3D Wooden Puzzle" },
    { img: hinh4, title: "Music Box" },
    { img: hinh5, title: "Vehicle" },
    { img: hinh6, title: "New Arrivals" },
  ];

  const handleShowDetail = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const renderStars = (level) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        color={i < level ? "#ffc107" : "#e4e5e9"}
        className="me-1"
      />
    ));
  };

  return (
    <div className="home-page bg-white">
      <Banner />

      <div className="container py-5">
        <h5 className="mb-4 fw-bold text-dark border-start border-4 border-primary ps-3">
          SẢN PHẨM MỚI
        </h5>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
          </div>
        ) : isError ? (
          <p className="text-danger text-center">
            Lỗi khi tải dữ liệu sản phẩm.
          </p>
        ) : (
          <Row className="g-4">
            {sanPhams?.map((item) => (
              <Col
                md={3}
                sm={6}
                key={item.maSp}
                onClick={() => handleShowDetail(item)}
                style={{ cursor: "pointer" }}
              >
                <ProductCard product={item} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* MODAL CHI TIẾT SẢN PHẨM */}
      <Modal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        size="lg"
        centered
      >
        <Modal.Body className="p-0 rounded-3 overflow-hidden border-0 shadow-lg">
          <div
            className="position-absolute end-0 top-0 p-3"
            style={{ zIndex: 10 }}
          >
            <div
              onClick={() => setShowDetail(false)}
              className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center"
              style={{
                width: "32px",
                height: "32px",
                cursor: "pointer",
                border: "1px solid #eee",
              }}
            >
              <FaTimes className="text-secondary" />
            </div>
          </div>
          <Row className="g-0">
            <Col
              md={6}
              className="bg-white p-4 d-flex flex-column align-items-center justify-content-center border-end"
            >
              <div className="mb-4 text-center w-100 p-2 bg-light rounded">
                <Image
                  src={selectedProduct?.hinhAnhUrl}
                  fluid
                  className="rounded"
                  style={{ maxHeight: "380px", objectFit: "contain" }}
                />
              </div>
              <div className="d-flex justify-content-around w-100 border-top pt-4 mt-auto">
                <div className="text-center px-2">
                  <FaTools className="text-muted mb-2" size={22} />
                  <div className="fw-bold text-dark">
                    {selectedProduct?.soManhGhep || "--"}
                  </div>
                  <div className="text-muted small">PIECES</div>
                </div>
                <div className="text-center border-start border-end px-4">
                  <FaClock className="text-muted mb-2" size={22} />
                  <div className="fw-bold text-dark">
                    {selectedProduct?.thoiGianGhep || "--"} h
                  </div>
                  <div className="text-muted small">TIME</div>
                </div>
                <div className="text-center px-2">
                  <FaStar className="text-muted mb-2" size={22} />
                  <div className="d-flex justify-content-center mb-1">
                    {renderStars(selectedProduct?.doKho || 0)}
                  </div>
                  <div className="text-muted small">DIFFICULTY</div>
                </div>
              </div>
            </Col>
            <Col md={6} className="p-4 bg-white d-flex flex-column">
              <h4 className="fw-bold text-dark mb-2">
                {selectedProduct?.tenSp}
              </h4>
              <p className="small text-muted mb-4 border-bottom pb-2">
                Mã SKU:{" "}
                <span className="fw-bold text-dark">
                  {selectedProduct?.maSku}
                </span>
              </p>
              <div className="mb-4 flex-grow-1">
                <h6 className="fw-bold text-uppercase small text-secondary mb-2">
                  Mô tả sản phẩm
                </h6>
                <div
                  className="text-secondary small"
                  style={{
                    lineHeight: "1.8",
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {selectedProduct?.moTa || "Sản phẩm lắp ráp mô hình tinh tế."}
                </div>
              </div>
              <div className="bg-light p-3 rounded-3 d-flex align-items-center mb-4 border">
                <FaBox className="text-primary me-2" size={18} />
                <span className="small fw-bold text-dark me-2">
                  Tồn kho tổng:
                </span>
                <span className="ms-auto fs-5 fw-bold text-primary">
                  {selectedProduct?.tonKhoTong}
                </span>
              </div>
              <div className="d-grid">
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

      <Features />

      <TopCategories categories={categories} />
    </div>
  );
}

export default Home;

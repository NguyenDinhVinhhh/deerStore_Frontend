import React from "react";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaCheckCircle,
  FaStore,
} from "react-icons/fa";
import { useBranch } from "../../hooks/use-branchs";

const Stores = () => {
  // 1. Lấy dữ liệu từ Hook chi nhánh
  const { data: storeData = [], isLoading, isError } = useBranch();

  // 2. Thông tin dịch vụ và giờ mở cửa set cứng
  const commonInfo = {
    openingHours: "09:30 AM - 10:00 PM",
    services: [
      "Trải nghiệm lắp ráp tại chỗ",
      "Gói quà miễn phí",
      "Hỗ trợ kỹ thuật 24/7",
      "Khu vui chơi trẻ em",
    ],
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">
          Không thể tải danh sách chi nhánh. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div
      className="pb-5"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      {/* Header Banner */}
      <div
        className="text-white text-center d-flex align-items-center justify-content-center shadow-sm mb-5"
        style={{
          height: "350px",
          background:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container>
          <h1
            className="display-4 fw-bold mb-3"
            style={{ letterSpacing: "2px" }}
          >
            HỆ THỐNG CỬA HÀNG
          </h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: "700px" }}>
            Khám phá không gian sáng tạo Deer Store tại các trung tâm thương mại
            hàng đầu.
          </p>
        </Container>
      </div>

      <Container>
        <Row className="g-4">
          {storeData.map((store) => (
            <Col lg={6} key={store.maChiNhanh}>
              <Card
                className="h-100 border-0 shadow-sm overflow-hidden"
                style={{
                  borderRadius: "15px",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <Row className="g-0 h-100">
                  {/* Cột trái: Brand Identity */}
                  <Col
                    md={4}
                    className="bg-primary d-flex flex-column align-items-center justify-content-center text-white p-4"
                  >
                    <FaStore size={50} className="mb-2 opacity-75" />
                    <div
                      className="fw-bold text-center small text-uppercase"
                      style={{ letterSpacing: "1px" }}
                    >
                      DEER STORE <br /> {store.tenChiNhanh.split("-")[0]}
                    </div>
                  </Col>

                  {/* Cột phải: Thông tin lấy từ API */}
                  <Col md={8}>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="fw-bold text-dark m-0">
                          Deer Store {store.tenChiNhanh}
                        </h5>
                        <Badge
                          bg="success"
                          pill
                          className="fw-normal px-3 py-2"
                          style={{ fontSize: "10px" }}
                        >
                          OPENING
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex mb-2 align-items-start">
                          <FaMapMarkerAlt className="text-danger mt-1 me-3 flex-shrink-0" />
                          <span
                            className="text-secondary"
                            style={{ fontSize: "14px", lineHeight: "1.5" }}
                          >
                            {store.diaChi}
                          </span>
                        </div>

                        <div className="d-flex mb-2 align-items-center">
                          <FaPhoneAlt className="text-primary me-3 flex-shrink-0" />
                          <span
                            className="text-dark fw-bold"
                            style={{ fontSize: "14px" }}
                          >
                            {store.sdt}
                          </span>
                        </div>

                        <div className="d-flex align-items-center">
                          <FaClock className="text-warning me-3 flex-shrink-0" />
                          <span
                            className="text-secondary"
                            style={{ fontSize: "14px" }}
                          >
                            Mở cửa:{" "}
                            <strong className="text-dark">
                              {commonInfo.openingHours}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Phần dịch vụ set cứng */}
                      <div className="pt-3 border-top">
                        <h6
                          className="text-uppercase fw-bold text-muted mb-2"
                          style={{ fontSize: "11px", letterSpacing: "1px" }}
                        >
                          Dịch vụ tại chi nhánh:
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                          {commonInfo.services.map((service, idx) => (
                            <div
                              key={idx}
                              className="d-flex align-items-center text-success fw-medium"
                              style={{ fontSize: "12px" }}
                            >
                              <FaCheckCircle className="me-1" />
                              <span>{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Stores;

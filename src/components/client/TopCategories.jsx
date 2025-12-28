import React from "react";
import { Row, Col } from "react-bootstrap";

const TopCategories = ({ categories }) => {
  return (
    <div className="container text-center py-5">
      <h3 className="fw-bold mb-3" style={{ color: "#555" }}>
        Các danh mục hàng đầu cho bạn
      </h3>
      <p className="text-muted mb-5">
        Khám phá các danh mục được đề xuất của chúng tôi để nhanh chóng tìm thấy
        bộ kit xây dựng ưa thích của bạn!
      </p>

      <Row className="justify-content-center">
        {categories.map((item, index) => (
          <Col xs={6} md={4} lg={2} className="mb-4" key={index}>
            <div className="box d-flex flex-column align-items-center">
              <img
                src={item.img}
                alt={item.title}
                className="img-fluid mb-3"
                style={{
                  height: "150px",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <h6 className="fw-bold text-secondary">{item.title}</h6>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TopCategories;

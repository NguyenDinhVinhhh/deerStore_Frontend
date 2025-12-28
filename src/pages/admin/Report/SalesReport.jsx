import React, { useState } from "react";
import {
  Card,
  Dropdown,
  ListGroup,
  Spinner,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import {
  FaChevronDown,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import reportApi from "../../../services/reportApi";
import { useBranch } from "../../../hooks/use-branchs";

const TopProductsCard = () => {
  const [range, setRange] = useState("MONTH");
  const [type, setType] = useState("ORDER");
  const [selectedBranch, setSelectedBranch] = useState("");

  const { data: branches = [] } = useBranch();

  const { data: reportResponse, isLoading } = useQuery({
    queryKey: ["top-products", range, type, selectedBranch],
    queryFn: () =>
      reportApi.getTopProducts({
        range,
        type,
        maChiNhanh: selectedBranch || null,
        limit: 10,
      }),
    keepPreviousData: true,
  });

  const topData = reportResponse?.data || [];

  const rangeLabels = {
    TODAY: "Hôm nay",
    "7_DAYS": "7 ngày qua",
    MONTH: "Tháng này",
    YEAR: "Năm nay",
  };

  const typeLabels = {
    ORDER: "Theo đơn hàng",
    QUANTITY: "Theo số lượng",
    REVENUE: "Theo doanh thu",
  };

  const rankColors = [
    "#007bff",
    "#28a745",
    "#ffc107",
    "#f87171",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f59e0b",
    "#64748b",
  ];

  return (
    <Card className="border-0 shadow-sm rounded-3">
      <Card.Header className="bg-white border-0 pt-4 px-4">
        <Row className="align-items-center g-3">
          {/* Tiêu đề góc trái */}
          <Col lg={3} md={12}>
            <h6
              className="fw-bold mb-0 text-uppercase small text-secondary"
              style={{ letterSpacing: "1px" }}
            >
              Top Sản Phẩm
            </h6>
          </Col>

          {/* Cụm 3 bộ lọc trên cùng 1 hàng */}
          <Col lg={9} md={12}>
            <Row className="g-2 justify-content-end">
              {/* 1. Lọc Chi nhánh */}
              <Col sm={4}>
                <div className="d-flex align-items-center bg-light rounded-2 px-2 border">
                  <FaMapMarkerAlt className="text-muted small me-2" />
                  <Form.Select
                    size="sm"
                    className="border-0 bg-transparent shadow-none small fw-bold py-2"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="">Toàn hệ thống</option>
                    {branches.map((b) => (
                      <option key={b.maChiNhanh} value={b.maChiNhanh}>
                        {b.tenChiNhanh}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>

              {/* 2. Lọc Thời gian */}
              <Col sm={3}>
                <Dropdown onSelect={(k) => setRange(k)} className="w-100">
                  <Dropdown.Toggle
                    variant="light"
                    size="sm"
                    className="w-100 border d-flex align-items-center justify-content-between py-2 bg-light"
                  >
                    <span className="small fw-bold">
                      <FaCalendarAlt className="me-2 text-primary" />
                      {rangeLabels[range]}
                    </span>
                    <FaChevronDown
                      style={{ fontSize: "10px" }}
                      className="ms-1"
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-sm border-0 small">
                    <Dropdown.Item eventKey="TODAY">Hôm nay</Dropdown.Item>
                    <Dropdown.Item eventKey="7_DAYS">7 ngày qua</Dropdown.Item>
                    <Dropdown.Item eventKey="MONTH">Tháng này</Dropdown.Item>
                    <Dropdown.Item eventKey="YEAR">Năm nay</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              {/* 3. Lọc Tiêu chí thống kê */}
              <Col sm={5}>
                <Dropdown onSelect={(k) => setType(k)} className="w-100">
                  <Dropdown.Toggle
                    variant="primary"
                    size="sm"
                    className="w-100 d-flex align-items-center justify-content-between py-2 shadow-sm border-0"
                  >
                    <span className="small fw-bold">
                      <FaChartLine className="me-2" />
                      Thống kê: {typeLabels[type]}
                    </span>
                    <FaChevronDown style={{ fontSize: "10px" }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-sm border-0 w-100 small">
                    <Dropdown.Item eventKey="ORDER">
                      Theo đơn hàng
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="QUANTITY">
                      Theo số lượng
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="REVENUE">
                      Theo doanh thu
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body className="px-0 pb-4">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner size="sm" animation="border" variant="primary" />
          </div>
        ) : (
          <ListGroup variant="flush">
            {topData.map((item, index) => (
              <ListGroup.Item
                key={item.maSp}
                className="border-0 d-flex align-items-center px-4 py-3"
                style={{ transition: "all 0.2s cursor: 'pointer'" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {/* Chỉ số Rank */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-4 text-white fw-bold shadow-sm"
                  style={{
                    width: "36px",
                    minWidth: "36px",
                    height: "36px",
                    fontSize: "14px",
                    backgroundColor: rankColors[index] || "#6c757d",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <div
                    className="fw-bold text-truncate text-dark mb-1"
                    style={{ fontSize: "0.95rem" }}
                    title={item.tenSp}
                  >
                    {item.tenSp}
                  </div>
                  <div className="text-muted small font-monospace">
                    {item.maSku}
                  </div>
                </div>

                {/* Kết quả dữ liệu */}
                <div
                  className="ms-auto text-end ps-3"
                  style={{ minWidth: "120px" }}
                >
                  <div className="fw-bold text-dark fs-6">
                    {type === "REVENUE"
                      ? `${item.tongDoanhThu.toLocaleString("vi-VN")} đ`
                      : type === "QUANTITY"
                      ? `${item.tongSoLuong.toLocaleString()} SP`
                      : `${item.tongDon.toLocaleString()} đơn`}
                  </div>
                </div>
              </ListGroup.Item>
            ))}

            {topData.length === 0 && (
              <div className="text-center py-5 text-muted small">
                Không tìm thấy dữ liệu thống kê phù hợp
              </div>
            )}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default TopProductsCard;

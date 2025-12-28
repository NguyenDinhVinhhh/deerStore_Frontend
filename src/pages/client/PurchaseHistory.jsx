import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Card,
  Spinner,
  Accordion,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaHistory,
  FaCalendarAlt,
  FaTag,
  FaBoxOpen,
  FaReceipt,
} from "react-icons/fa";
import historyApi from "../../services/historyApi";

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        // Sử dụng maKhachHang (ID) đã được thống nhất từ các bước trước
        const maKh = userData?.maKhachHang;

        if (!maKh) {
          setError("Không tìm thấy thông tin định danh người dùng.");
          setLoading(false);
          return;
        }

        const response = await historyApi.getHistory(maKh);
        setHistory(response);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Không thể tải lịch sử mua hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Đang tải lịch sử mua hàng...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex align-items-center mb-4 border-bottom pb-3">
        <FaHistory className="text-primary me-3" size={30} />
        <h2 className="fw-bold mb-0">LỊCH SỬ MUA HÀNG</h2>
      </div>

      {error ? (
        <div className="alert alert-warning text-center">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <FaBoxOpen size={50} className="text-muted mb-3" />
          <p className="text-muted">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <Accordion defaultActiveKey="0">
          {history.map((order, index) => (
            <Accordion.Item
              eventKey={index.toString()}
              key={order.maHoaDon}
              className="mb-3 border rounded shadow-sm"
            >
              <Accordion.Header>
                <div className="d-flex justify-content-between w-100 pe-3 align-items-center">
                  <div>
                    <span className="fw-bold text-primary">
                      <FaReceipt className="me-2" />
                      Mã đơn: #{order.maHoaDon}
                    </span>
                    <span className="mx-3 text-muted small d-none d-md-inline">
                      <FaCalendarAlt className="me-1" />{" "}
                      {formatDate(order.ngayMua)}
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-danger fs-5">
                      {formatCurrency(order.thanhTien)}
                    </div>
                    {order.giamGia > 0 && (
                      <small className="text-success text-decoration-line-through">
                        {formatCurrency(order.tongTienGoc)}
                      </small>
                    )}
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <h6 className="fw-bold mb-3 border-bottom pb-2 text-secondary">
                  CHI TIẾT ĐƠN HÀNG
                </h6>
                <Table responsive hover borderless className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-end">Đơn giá</th>
                      <th className="text-end">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.chiTiet.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="fw-medium">{item.tenSanPham}</div>
                        </td>
                        <td className="text-center">x{item.soLuong}</td>
                        <td className="text-end">
                          {formatCurrency(item.donGia)}
                        </td>
                        <td className="text-end fw-bold">
                          {formatCurrency(item.thanhTien)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Card className="bg-light border-0 mt-3">
                  <Card.Body>
                    <Row className="mb-2">
                      <Col xs={8} className="text-end text-muted">
                        Tổng tiền hàng:
                      </Col>
                      <Col xs={4} className="text-end">
                        {formatCurrency(order.tongTienGoc)}
                      </Col>
                    </Row>
                    {order.giamGia > 0 && (
                      <Row className="mb-2 text-success">
                        <Col xs={8} className="text-end">
                          <FaTag className="me-1" /> Giảm giá:
                        </Col>
                        <Col xs={4} className="text-end">
                          -{formatCurrency(order.giamGia)}
                        </Col>
                      </Row>
                    )}
                    <Row className="fw-bold fs-5 border-top pt-2">
                      <Col xs={8} className="text-end">
                        Tổng thanh toán:
                      </Col>
                      <Col xs={4} className="text-end text-danger">
                        {formatCurrency(order.thanhTien)}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default PurchaseHistory;

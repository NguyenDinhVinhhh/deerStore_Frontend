import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Badge,
  Card,
  Spinner,
  Accordion,
  ListGroup,
} from "react-bootstrap";
import {
  FaHistory,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBoxOpen,
} from "react-icons/fa";
import historyApi from "../../services/historyApi";

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Lấy thông tin user từ localStorage để lấy số điện thoại
        const userData = JSON.parse(localStorage.getItem("user"));
        const sdt = userData?.maKhachHang;
        console.log("a", sdt);
        if (!sdt) {
          setError("Không tìm thấy thông tin số điện thoại người dùng.");
          setLoading(false);
          return;
        }

        const response = await historyApi.getHistory(sdt);
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

  // Hàm định dạng tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Hàm định dạng ngày tháng
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
        <Accordion defaultActiveKey="0 shadow-sm">
          {history.map((order, index) => (
            <Accordion.Item
              eventKey={index.toString()}
              key={order.maHoaDon}
              className="mb-3 border rounded"
            >
              <Accordion.Header>
                <div className="d-flex justify-content-between w-100 pe-3 align-items-center">
                  <div>
                    <span className="fw-bold text-primary">
                      #HD{order.maHoaDon}
                    </span>
                    <span className="mx-3 text-muted small">
                      <FaCalendarAlt className="me-1" />{" "}
                      {formatDate(order.ngayMua)}
                    </span>
                  </div>
                  <div className="fw-bold text-danger">
                    {formatCurrency(order.tongTien)}
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <h6 className="fw-bold mb-3 border-bottom pb-2">
                  Chi tiết sản phẩm
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
                  <tfoot>
                    <tr className="border-top">
                      <td colSpan="3" className="text-end fw-bold pt-3">
                        Tổng cộng:
                      </td>
                      <td className="text-end text-danger fw-bold fs-5 pt-3">
                        {formatCurrency(order.tongTien)}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default PurchaseHistory;

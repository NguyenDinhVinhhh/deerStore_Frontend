import React from "react";
import {
  Col,
  Card,
  Button,
  Nav,
  Table,
  Form,
  InputGroup,
} from "react-bootstrap";
import { BoxSeam, Trash, Dash, Plus as PlusIcon } from "react-bootstrap-icons";

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "0₫";
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
};

// Cập nhật mảng QUICK_ACTIONS để chuẩn bị cho giao diện khối
const QUICK_ACTIONS = [
  { label: "Thêm dịch vụ (F9)", key: "service" },
  { label: "Chiết khấu đơn (F6)", key: "discount" },
  { label: "Khuyến mại (F8)", key: "promo" }, // Sửa F9 -> F8 theo giao diện
  { label: "Đổi quà", key: "gift" },
  { label: "Thiết lập chung", key: "settings" },
  { label: "Đổi giá bán hàng", key: "price" },
  { label: "Thông tin khách hàng", key: "info" },
  { label: "Xóa toàn bộ sản phẩm", key: "clear" },
  { label: "Đổi trả hàng", key: "return" },
  { label: "Xem danh sách đơn hàng", key: "orders" },
  { label: "Xem báo cáo", key: "report" }, // Bổ sung theo giao diện mới
  { label: "Tất cả thao tác", key: "all" },
];

// Component con cho một dòng sản phẩm
// Thêm prop 'index' để hiển thị STT
const CartItemRow = ({ item, index, onUpdateQuantity, onRemoveItem }) => {
  const subtotal = item.donGia * item.quantity;

  const handleQuantityChange = (e) => {
    let newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }
    onUpdateQuantity(item.maSp, newQuantity);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.maSp, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.maSp, item.quantity + 1);
  };

  return (
    <tr className="align-middle">
      {/* CỘT MỚI: STT */}
      <td style={{ width: "5%" }}>{index + 1}</td>

      {/* Tên & SKU */}
      <td style={{ width: "35%" }}>
        <div className="fw-bold">{item.tenSp}</div>
        <small className="text-muted">{item.maSku}</small>
      </td>

      {/* Đơn giá */}
      <td style={{ width: "15%" }}>{formatCurrency(item.donGia)}</td>

      {/* Số lượng */}
      <td style={{ width: "15%" }}>
        <InputGroup size="sm">
          <Button
            variant="outline-secondary"
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
          >
            <Dash size={12} />
          </Button>
          <Form.Control
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="text-center"
            style={{
              maxWidth: "40px",
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
          />
          <Button variant="outline-secondary" onClick={handleIncrease}>
            <PlusIcon size={12} />
          </Button>
        </InputGroup>
      </td>

      {/* Thành tiền */}
      <td className="fw-bold" style={{ width: "20%" }}>
        {formatCurrency(subtotal)}
      </td>

      {/* Thao tác */}
      <td className="text-center" style={{ width: "10%" }}>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemoveItem(item.maSp)}
        >
          <Trash size={14} />
        </Button>
      </td>
    </tr>
  );
};

// Component chính OrderDetailsCol
const OrderDetailsCol = ({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const isCartEmpty = cartItems.length === 0;

  return (
    <Col md={8} className="order-details-col pe-2">
      <Card style={{ minHeight: "calc(109vh - 150px)" }}>
        {isCartEmpty ? (
          /* TRẠNG THÁI 1: ĐƠN HÀNG TRỐNG */
          <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
            <BoxSeam size={80} className="text-secondary mb-3" />
            <h5>Đơn hàng của bạn chưa có sản phẩm nào</h5>
            <Button variant="primary" className="mt-2">
              Thêm sản phẩm ngay
            </Button>
          </Card.Body>
        ) : (
          /* TRẠNG THÁI 2: CÓ SẢN PHẨM */
          <Card.Body
            className="p-0"
            style={{ maxHeight: "calc(109vh - 270px)", overflowY: "auto" }}
          >
            <Table hover responsive className="mb-0">
              <thead
                className="sticky-top"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <tr>
                  <th style={{ width: "5%" }}>STT</th>
                  <th style={{ width: "35%" }}>Sản phẩm</th>
                  <th style={{ width: "15%" }}>Đơn giá</th>
                  <th style={{ width: "15%" }}>SL</th>
                  <th style={{ width: "20%" }}>Thành tiền</th>
                  <th className="text-center" style={{ width: "10%" }}>
                    #
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <CartItemRow
                    key={item.maSp}
                    index={index}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </tbody>
            </Table>
          </Card.Body>
        )}

        {/* Phần Thao tác nhanh và danh sách sản phẩm */}
        <Card.Footer className="chat-footer">
          {/* Tabs */}
          <Nav
            variant="tabs"
            defaultActiveKey="quick-action"
            className="footer-tabs"
          >
            <Nav.Item>
              <Nav.Link eventKey="quick-action" className="footer-tab">
                <span className="tab-title tab-active">Thao tác nhanh</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="product-list" className="footer-tab">
                <span className="tab-title">Danh sách sản phẩm</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Quick actions grid */}
          <div className="quick-grid">
            {QUICK_ACTIONS.map((item, index) => (
              <button
                key={index}
                type="button"
                className="quick-tile"
                onClick={item.onClick} // nếu có
              >
                {/* Nếu có icon thì render ở đây */}
                {/* <span className="quick-icon">{item.icon}</span> */}

                <span className="quick-label">{item.label}</span>
                <span className="quick-sub">Chạm để thực hiện</span>
              </button>
            ))}
          </div>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default OrderDetailsCol;

import React, { useState, useCallback, useEffect } from "react";
import {
  Col,
  Card,
  Button,
  Form,
  Row,
  Spinner,
  Modal,
  ListGroup,
} from "react-bootstrap";
import {
  PersonPlus,
  CreditCard,
  CashStack,
  QrCode,
  Bank,
  BoxArrowUpRight,
} from "react-bootstrap-icons";
import khachHangApi from "../../services/customersApi";
import invoiceApi from "../../services/invoiceApi";

const PAYMENT_METHODS = [
  {
    key: "CASH",
    name: "Tiền mặt",
    icon: <CashStack size={18} />,
    color: "success",
  },
  {
    key: "BANK_TRANSFER",
    name: "Chuyển khoản",
    icon: <Bank size={18} />,
    color: "info",
  },
  {
    key: "MOMO",
    name: "Momo (QR)",
    icon: <QrCode size={18} />,
    color: "danger",
  },
  {
    key: "VISA_MASTER",
    name: "Thẻ (Visa/Master)",
    icon: <CreditCard size={18} />,
    color: "primary",
  },
];

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "0₫";
  const sign = amount < 0 ? "-" : "";
  const absoluteAmount = Math.abs(amount);
  const numericAmount =
    typeof absoluteAmount === "number"
      ? absoluteAmount
      : parseFloat(absoluteAmount);

  return sign + new Intl.NumberFormat("vi-VN").format(numericAmount) + "₫";
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const toInt = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 0;
  return Math.round(Number(value));
};

// Lấy mã tài khoản an toàn hơn (để tránh lỗi crash nếu localStorage rỗng)
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

// ============================================================================
// COMPONENT CHÍNH
// ============================================================================
const PaymentCol = ({
  cartSummary = {},
  onSelectCustomer,
  onCustomerDiscountChange,
  cartItems = [],
  maChiNhanh,
}) => {
  // --- STATE ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [momoPaymentUrl, setMomoPaymentUrl] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [customerPaidInput, setCustomerPaidInput] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // States tìm kiếm khách hàng
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerSearchResults, setCustomerSearchResults] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isCustomerSearchFocused, setIsCustomerSearchFocused] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDiscountAmount, setCustomerDiscountAmount] = useState(0);

  // --- TÍNH TOÁN SỐ LIỆU ---
  const {
    totalAmount: rawTotalAmount = 0,
    discount: rawDiscount = 0,
    netPayable: rawNetPayable = 0,
  } = cartSummary;

  const totalAmount = toInt(rawTotalAmount);
  const discount = toInt(rawDiscount);
  const netPayable = toInt(rawNetPayable);

  // 💡 LOGIC MỚI CHO customerPaidRaw: Chỉ dùng input khi là CASH
  const customerPaidRaw =
    paymentMethod.key === "CASH"
      ? parseFloat(customerPaidInput) || 0
      : netPayable; // Nếu không phải CASH, mặc định coi như khách đã trả đủ

  const customerPaid = toInt(customerPaidRaw);

  const change = toInt(
    // Tiền thừa chỉ tính khi là CASH, còn lại là 0
    paymentMethod.key === "CASH" ? customerPaid - netPayable : 0
  );

  // --- LOGIC KHÁCH HÀNG ---
  const calculateCustomerDiscount = useCallback(
    (customer, currentTotalAmount) => {
      if (customer && customer.phanTramChietKhau > 0) {
        return toInt(
          Math.round((currentTotalAmount * customer.phanTramChietKhau) / 100)
        );
      }
      return 0;
    },
    []
  );

  useEffect(() => {
    if (selectedCustomer) {
      const newDiscount = calculateCustomerDiscount(
        selectedCustomer,
        totalAmount
      );
      setCustomerDiscountAmount(newDiscount);
      if (onCustomerDiscountChange) onCustomerDiscountChange(newDiscount);
    } else if (customerDiscountAmount !== 0) {
      setCustomerDiscountAmount(0);
      if (onCustomerDiscountChange) onCustomerDiscountChange(0);
    }
  }, [
    selectedCustomer,
    totalAmount,
    calculateCustomerDiscount,
    onCustomerDiscountChange,
    customerDiscountAmount,
  ]);

  const fetchCustomers = useCallback(async (keyword) => {
    setCustomerLoading(true);
    try {
      let response;
      if (!keyword.trim()) {
        response = await khachHangApi.getAll();
      } else {
        response = await khachHangApi.search(keyword);
      }
      setCustomerSearchResults(response);
    } catch (error) {
      console.error("Lỗi tìm khách hàng:", error);
      setCustomerSearchResults([]);
    } finally {
      setCustomerLoading(false);
    }
  }, []);

  const debouncedFetchCustomers = useCallback(debounce(fetchCustomers, 300), [
    fetchCustomers,
  ]);

  const handleCustomerInputChange = (e) => {
    const value = e.target.value;
    setCustomerSearchTerm(value);
    debouncedFetchCustomers(value);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm("");
    setCustomerSearchResults([]);
    const newDiscount = calculateCustomerDiscount(customer, totalAmount);
    setCustomerDiscountAmount(newDiscount);
    if (onCustomerDiscountChange) onCustomerDiscountChange(newDiscount);
    onSelectCustomer(customer);
  };

  const handleRemoveCustomer = () => {
    setSelectedCustomer(null);
    setCustomerDiscountAmount(0);
    if (onCustomerDiscountChange) onCustomerDiscountChange(0);
    onSelectCustomer(null);
  };

  const handleResetForm = () => {
    setCustomerPaidInput("");
    setPaymentMethod(PAYMENT_METHODS[0]);
    setOrderNote("");
    setSelectedCustomer(null);
    setCustomerDiscountAmount(0);
    onSelectCustomer(null);
    if (onCustomerDiscountChange) onCustomerDiscountChange(0);
    setMomoPaymentUrl(null);
  };

  const handleShowPaymentModal = () => {
    if (netPayable <= 0) return;
    if (paymentMethod.key === "CASH" && !customerPaidInput) {
      setCustomerPaidInput(netPayable.toString());
    }
    setShowPaymentModal(true);
  };

  const handleChangePaymentMethod = (method) => {
    setPaymentMethod(method);
    // Khi đổi phương thức, reset input tiền nếu không phải CASH
    if (method.key !== "CASH") {
      setCustomerPaidInput("");
    } else {
      // Nếu là CASH, set mặc định là đủ tiền
      if (netPayable > 0) {
        setCustomerPaidInput(netPayable.toString());
      }
    }
  };

  // ==========================================================================
  // 🔥 HÀM XỬ LÝ THANH TOÁN (ĐÃ UPDATE LOGIC MOMO)
  // ==========================================================================
  const handleFinalizeOrder = async () => {
    // 1. Validation Frontend
    if (netPayable <= 0) {
      alert("Tổng tiền cần thanh toán phải lớn hơn 0 VND.");
      return;
    }

    // Kiểm tra tiền khách đưa cho CASH
    if (paymentMethod.key === "CASH" && customerPaid < netPayable) {
      alert("Khách chưa đưa đủ tiền mặt để thanh toán.");
      handleShowPaymentModal();
      return;
    }

    // Kiểm tra User trong LocalStorage
    const user = getUserFromStorage();
    const maTaiKhoan = user?.maTk;

    console.log("Đang thực hiện thanh toán với User:", user); // Debug log

    if (!maTaiKhoan) {
      alert(
        "LỖI ĐĂNG NHẬP: Không tìm thấy mã tài khoản.\nVui lòng đăng xuất và đăng nhập lại."
      );
      return;
    }

    setIsProcessing(true);

    const FALLBACK_MA_CHI_NHANH = 1;

    // 💡 LOGIC CHÍNH: Thay so_tien thành 0.00 cho Online Payment (MOMO/VISA)
    const isOnlinePayment =
      paymentMethod.key === "MOMO" || paymentMethod.key === "VISA_MASTER";

    // Nếu là online, gửi 0.00 để Backend tự tính (theo kết quả test thành công).
    // Nếu là offline/chuyển khoản, gửi netPayable (khách trả đủ).
    const paymentAmount = isOnlinePayment ? 0.0 : netPayable;

    // 2. Payload
    const invoicePayload = {
      hoa_don: {
        ma_tk: maTaiKhoan,
        ma_chi_nhanh: maChiNhanh || FALLBACK_MA_CHI_NHANH,
        ma_kh: selectedCustomer?.maKh || null,
        ma_km: null,
        ma_voucher_su_dung: null,
        ghi_chu: orderNote,
      },
      items: cartItems.map((item) => ({
        ma_sp: item.ma_sp,
        so_luong: item.so_luong,
      })),
      payment: [
        {
          phuong_thuc: paymentMethod.key,
          so_tien: paymentAmount, // <--- ĐÃ SỬA THÀNH finalPaymentAmount
          ghi_chu: `Thanh toán qua ${paymentMethod.name}`,
        },
      ],
    };

    try {
      // 3. Gọi API
      console.log("Payload gửi đi:", invoicePayload);
      const response = await invoiceApi.createInvoice(invoicePayload);
      const result = response.data || response;

      // 4. Xử lý kết quả thành công
      if (result.payUrl) {
        setMomoPaymentUrl(result.payUrl);
      } else {
        alert("Tạo đơn hàng và thanh toán thành công!");
        handleResetForm();
      }
    } catch (error) {
      // ... (Phần bắt lỗi chi tiết giữ nguyên) ...
      console.error("🚨 LỖI GỐC (Raw Error):", error);

      let finalMessage = "Đã có lỗi không xác định xảy ra.";

      if (error.response) {
        // Server đã trả về response (nhưng status code là lỗi 4xx, 5xx)
        console.log("Server Response Data:", error.response.data);
        console.log("Server Status:", error.response.status);

        const data = error.response.data;

        // Ưu tiên lấy message từ object trả về của Backend
        if (typeof data === "string") {
          finalMessage = data; // Nếu backend trả về string thô
        } else if (data?.message) {
          finalMessage = data.message; // Chuẩn Spring Boot
        } else if (data?.error) {
          finalMessage = data.error;
        } else {
          // Nếu object lạ, chuyển thành string để đọc
          finalMessage = JSON.stringify(data);
        }
      } else if (error.request) {
        // Request đã gửi nhưng không nhận được phản hồi (Mất mạng, sai IP)
        finalMessage =
          "Không thể kết nối đến Server. Vui lòng kiểm tra đường truyền Internet hoặc địa chỉ API.";
      } else {
        // Lỗi khi setup request
        finalMessage = error.message;
      }

      // Hiển thị lỗi rõ ràng lên màn hình
      alert(`🛑 LỖI THANH TOÁN:\n\n${finalMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Col md={4} className="payment-col ps-2">
      <Card style={{ minHeight: "calc(100vh - 70px)" }} className="shadow-sm">
        <Card.Body>
          {/* --- KHÁCH HÀNG --- */}
          <div className="mb-3" style={{ position: "relative" }}>
            {selectedCustomer ? (
              <div className="p-2 bg-primary text-white rounded d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">{selectedCustomer.hoTen}</div>
                  <small>
                    {selectedCustomer.sdt} ({selectedCustomer.tenNhom})
                  </small>
                </div>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleRemoveCustomer}
                >
                  Xóa
                </Button>
              </div>
            ) : (
              <Form.Group>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Thêm khách hàng..."
                    value={customerSearchTerm}
                    onChange={handleCustomerInputChange}
                    onFocus={() => {
                      setIsCustomerSearchFocused(true);
                      if (
                        !customerSearchTerm &&
                        customerSearchResults.length === 0
                      )
                        fetchCustomers("");
                    }}
                    onBlur={() =>
                      setTimeout(() => setIsCustomerSearchFocused(false), 200)
                    }
                    className="rounded-start"
                  />
                  <Button variant="light">
                    <PersonPlus size={18} />
                  </Button>
                </div>
              </Form.Group>
            )}

            {/* Kết quả tìm kiếm */}
            {(isCustomerSearchFocused || customerSearchTerm) &&
              (customerSearchResults.length > 0 || customerLoading) &&
              !selectedCustomer && (
                <div
                  className="list-group position-absolute w-100 shadow-lg border mt-1"
                  style={{
                    top: "100%",
                    left: 0,
                    zIndex: 1001,
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  {customerLoading ? (
                    <div className="list-group-item text-center">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang tải...
                    </div>
                  ) : (
                    customerSearchResults.map((customer) => (
                      <button
                        key={customer.maKh}
                        className="list-group-item list-group-item-action py-2"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <div className="fw-bold">{customer.hoTen}</div>
                        <small className="text-muted">
                          {customer.sdt} - {customer.tenNhom}
                        </small>
                      </button>
                    ))
                  )}
                </div>
              )}
          </div>

          <hr />

          {/* --- CHI TIẾT TIỀN --- */}
          <div className="mb-3">
            <Row className="mb-2 text-dark fw-bold">
              <Col>Tổng tiền hàng:</Col>
              <Col className="text-end">{formatCurrency(totalAmount)}</Col>
            </Row>
            <Row className="mb-2">
              <Col>
                Chiết khấu hạng
                {selectedCustomer &&
                  ` (${selectedCustomer.phanTramChietKhau}%)`}
              </Col>
              <Col className="text-end text-danger">
                -{formatCurrency(customerDiscountAmount)}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>Chiết khấu KM</Col>
              <Col className="text-end text-danger">
                -{formatCurrency(discount)}
              </Col>
            </Row>
          </div>
          <hr />

          {/* --- THANH TOÁN --- */}
          <div className="mb-3">
            <h4 className="text-primary d-flex justify-content-between mb-3 p-2 bg-light rounded shadow-sm">
              <div>KHÁCH PHẢI TRẢ</div>
              <div>{formatCurrency(netPayable)}</div>
            </h4>

            <Row className="mb-3 border-bottom pb-2">
              <Col md={5} className="fw-bold d-flex align-items-center">
                Hình thức:
              </Col>
              <Col
                md={7}
                className="text-end fw-bold d-flex align-items-center justify-content-end"
              >
                <span className={`text-${paymentMethod.color} me-2`}>
                  {paymentMethod.icon}
                </span>
                <span className="text-dark">{paymentMethod.name}</span>
              </Col>
            </Row>

            {/* 💡 CHỈ HIỂN THỊ TIỀN KHÁCH ĐƯA VÀ TIỀN THỪA KHI LÀ CASH */}
            {paymentMethod.key === "CASH" ? (
              <>
                <Row className="mb-2">
                  <Col>Tiền khách đưa </Col>
                  <Col className="text-end fw-bold">
                    {formatCurrency(customerPaid)}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>Tiền thừa</Col>
                  <Col className="text-end fw-bold text-success">
                    {formatCurrency(change)}
                  </Col>
                </Row>
              </>
            ) : (
              <div className="alert alert-info py-2 text-center my-2">
                Thanh toán online: Khách trả {formatCurrency(netPayable)}
              </div>
            )}
          </div>
        </Card.Body>

        <Card.Footer className="bg-white pt-3">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Ghi chú đơn hàng</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              placeholder="Nhập ghi chú..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleShowPaymentModal}
              disabled={isProcessing}
            >
              Đổi hình thức
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleFinalizeOrder}
              disabled={netPayable <= 0 || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                "THANH TOÁN"
              )}
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* --- MODAL 1: CHỌN PHƯƠNG THỨC THANH TOÁN --- */}
      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Chọn Phương thức Thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="text-center text-primary mb-3">
            Cần thanh toán: {formatCurrency(netPayable)}
          </h4>

          <ListGroup horizontal className="d-flex justify-content-between mb-3">
            {PAYMENT_METHODS.map((method) => (
              <ListGroup.Item
                key={method.key}
                action
                onClick={() => handleChangePaymentMethod(method)}
                active={paymentMethod.key === method.key}
                className="d-flex flex-column align-items-center p-3 text-center"
                style={{ flex: 1, borderRadius: "8px" }}
              >
                <span className="mb-1">{method.icon}</span>
                <small className="fw-bold">{method.name}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* 💡 CHỈ HIỂN THỊ INPUT KHI LÀ CASH */}
          {paymentMethod.key === "CASH" && (
            <Form.Group className="mb-3 p-3 border rounded bg-light">
              <Form.Label className="fw-bold">Tiền khách đưa</Form.Label>
              <Form.Control
                type="number"
                value={customerPaidInput}
                onChange={(e) => setCustomerPaidInput(e.target.value)}
                placeholder={netPayable.toString()}
                className="fs-4 text-primary"
              />
              <div className="d-flex justify-content-between mt-2 gap-2">
                {[0, 10000, 50000, 100000].map((val) => (
                  <Button
                    key={val}
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      setCustomerPaidInput((netPayable + val).toString())
                    }
                  >
                    {val === 0 ? "Đủ" : `+${val / 1000}k`}
                  </Button>
                ))}
              </div>
            </Form.Group>
          )}

          {/* 💡 THÔNG BÁO CHO THANH TOÁN ONLINE */}
          {paymentMethod.key !== "CASH" && (
            <div className="alert alert-info text-center">
              Xác nhận thanh toán **{formatCurrency(netPayable)}** qua **
              {paymentMethod.name}**.
            </div>
          )}

          <div
            className={`mt-3 p-3 rounded text-center fw-bold fs-5 ${
              change >= 0
                ? "bg-success-subtle text-success"
                : "bg-danger-subtle text-danger"
            }`}
          >
            {change >= 0 ? "Tiền thừa trả khách:" : "Khách còn thiếu:"}
            <span className="ms-2 fs-4">
              {formatCurrency(Math.abs(change))}
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={() => setShowPaymentModal(false)}>
            XÁC NHẬN
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- MODAL 2: XÁC NHẬN MỞ MOMO --- */}
      <Modal
        show={!!momoPaymentUrl}
        onHide={() => setMomoPaymentUrl(null)}
        backdrop="static"
        centered
      >
        <Modal.Header className="bg-danger text-white">
          <Modal.Title>
            <QrCode className="me-2" />
            Thanh toán MoMo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <p className="fs-5">Đơn hàng đã được khởi tạo thành công.</p>
          <p className="text-muted mb-4">
            Vui lòng nhấn nút bên dưới để mở trang thanh toán MoMo.
          </p>

          <Button
            variant="danger"
            size="lg"
            className="w-100 py-3 fw-bold shadow"
            onClick={() => {
              if (momoPaymentUrl) {
                window.open(momoPaymentUrl, "_blank");
                handleResetForm();
              }
            }}
          >
            <BoxArrowUpRight className="me-2" />
            MỞ ỨNG DỤNG MOMO
          </Button>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <small className="text-muted">
            Cửa sổ thanh toán sẽ mở trong tab mới
          </small>
        </Modal.Footer>
      </Modal>
    </Col>
  );
};

export default PaymentCol;

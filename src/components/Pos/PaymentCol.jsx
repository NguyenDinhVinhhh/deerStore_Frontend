// PaymentCol.jsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
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
  PlusSlashMinus,
} from "react-bootstrap-icons";
import khachHangApi from "../../services/customersApi";
import invoiceApi from "../../services/invoiceApi";
import AddCustomer from "./AddCustomer";
import VoucherModal from "./VoucherModal";
import { toast } from "react-toastify";

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
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const toInt = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 0;
  return Math.round(Number(value));
};

const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const PaymentCol = ({
  cartSummary = {},
  cartItems = [],
  maChiNhanh,

  // ✅ NEW: per-order state persistence
  orderId,
  initialPaymentState,
  onPaymentStateChange,
  onCheckoutSuccess,

  onSelectCustomer,
  onCustomerDiscountChange,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [momoPaymentUrl, setMomoPaymentUrl] = useState(null);

  // --------- local UI states (nhưng hydrate từ initialPaymentState) ----------
  const initialMethod = useMemo(() => {
    const key = initialPaymentState?.paymentMethodKey || "CASH";
    return PAYMENT_METHODS.find((m) => m.key === key) || PAYMENT_METHODS[0];
  }, [initialPaymentState?.paymentMethodKey]);

  const [paymentMethod, setPaymentMethod] = useState(initialMethod);
  const [customerPaidInput, setCustomerPaidInput] = useState("");
  const [orderNote, setOrderNote] = useState(
    initialPaymentState?.orderNote || ""
  );
  const [itemsVoucherDiscount, setItemsVoucherDiscount] = useState(
    initialPaymentState?.itemsVoucherDiscount || []
  );
  const [selectedCustomer, setSelectedCustomer] = useState(
    initialPaymentState?.selectedCustomer || null
  );

  const [isProcessing, setIsProcessing] = useState(false);

  // search customer UI
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerSearchResults, setCustomerSearchResults] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isCustomerSearchFocused, setIsCustomerSearchFocused] = useState(false);
  const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
  const [isShowModalVoucher, setIsShowModalVoucher] = useState(false);

  // ✅ Khi đổi orderId => hydrate lại toàn bộ state theo đơn
  useEffect(() => {
    const key = initialPaymentState?.paymentMethodKey || "CASH";
    setPaymentMethod(
      PAYMENT_METHODS.find((m) => m.key === key) || PAYMENT_METHODS[0]
    );
    setOrderNote(initialPaymentState?.orderNote || "");
    setItemsVoucherDiscount(initialPaymentState?.itemsVoucherDiscount || []);
    setSelectedCustomer(initialPaymentState?.selectedCustomer || null);
    setCustomerPaidInput("");
    setMomoPaymentUrl(null);
    setShowPaymentModal(false);
    setCustomerSearchTerm("");
    setCustomerSearchResults([]);
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // --------- money summary ----------
  const {
    totalAmount: rawTotalAmount = 0,
    discount: rawDiscount = 0,
    netPayable: rawNetPayable = 0,
  } = cartSummary;
  const totalAmount = toInt(rawTotalAmount);
  const discount = toInt(rawDiscount);

  const voucherDiscountTotal = useMemo(
    () =>
      (itemsVoucherDiscount || []).reduce((sum, v) => sum + (v.giaTri || 0), 0),
    [itemsVoucherDiscount]
  );

  const netPayable = toInt(rawNetPayable - voucherDiscountTotal);

  const customerPaidRaw =
    paymentMethod.key === "CASH"
      ? parseFloat(customerPaidInput) || 0
      : netPayable;

  const customerPaid = toInt(customerPaidRaw);
  const change = toInt(
    paymentMethod.key === "CASH" ? customerPaid - netPayable : 0
  );

  // --------- customer discount ----------
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
      onCustomerDiscountChange?.(newDiscount);
    } else {
      onCustomerDiscountChange?.(0);
    }
  }, [
    selectedCustomer,
    totalAmount,
    calculateCustomerDiscount,
    onCustomerDiscountChange,
  ]);

  // --------- persist per order ----------
  const persistPatch = useCallback(
    (patch) => {
      onPaymentStateChange?.(patch);
    },
    [onPaymentStateChange]
  );

  useEffect(() => {
    persistPatch({ paymentMethodKey: paymentMethod?.key });
  }, [paymentMethod?.key, persistPatch]);

  useEffect(() => {
    persistPatch({ orderNote });
  }, [orderNote, persistPatch]);

  useEffect(() => {
    persistPatch({ itemsVoucherDiscount });
  }, [itemsVoucherDiscount, persistPatch]);

  useEffect(() => {
    persistPatch({ selectedCustomer });
  }, [selectedCustomer, persistPatch]);

  // --------- customer search ----------
  const fetchCustomers = useCallback(async (keyword) => {
    setCustomerLoading(true);
    try {
      let response;
      if (!keyword.trim()) response = await khachHangApi.getAll();
      else response = await khachHangApi.search(keyword);
      setCustomerSearchResults(response || []);
    } catch (error) {
      console.error("Lỗi tìm khách hàng:", error);
      setCustomerSearchResults([]);
    } finally {
      setCustomerLoading(false);
    }
  }, []);

  const debouncedFetchCustomers = useMemo(
    () => debounce(fetchCustomers, 300),
    [fetchCustomers]
  );

  const handleCustomerInputChange = (e) => {
    const value = e.target.value;
    setCustomerSearchTerm(value);
    debouncedFetchCustomers(value);
  };

  const handleSelectCustomerLocal = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm("");
    setCustomerSearchResults([]);

    const newDiscount = calculateCustomerDiscount(customer, totalAmount);
    onCustomerDiscountChange?.(newDiscount);
    onSelectCustomer?.(customer);
  };

  const handleRemoveCustomer = () => {
    setSelectedCustomer(null);
    onCustomerDiscountChange?.(0);
    onSelectCustomer?.(null);
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
    if (method.key !== "CASH") {
      setCustomerPaidInput("");
    } else {
      if (netPayable > 0) setCustomerPaidInput(netPayable.toString());
    }
  };

  const handleResetLocalForm = () => {
    setCustomerPaidInput("");
    setPaymentMethod(PAYMENT_METHODS[0]);
    setOrderNote("");
    setSelectedCustomer(null);
    onSelectCustomer?.(null);
    onCustomerDiscountChange?.(0);
    setItemsVoucherDiscount([]);
    setMomoPaymentUrl(null);
    setShowPaymentModal(false);
  };

  // --------- checkout ----------
  const handleFinalizeOrder = async () => {
    if (netPayable <= 0) {
      alert("Tổng tiền cần thanh toán phải lớn hơn 0 VND.");
      return;
    }

    if (paymentMethod.key === "CASH" && customerPaid < netPayable) {
      handleShowPaymentModal();
      return;
    }

    const user = getUserFromStorage();
    const maTaiKhoan = user?.maTk;
    if (!maTaiKhoan) {
      alert(
        "LỖI ĐĂNG NHẬP: Không tìm thấy mã tài khoản.\nVui lòng đăng xuất và đăng nhập lại."
      );
      return;
    }

    setIsProcessing(true);

    const FALLBACK_MA_CHI_NHANH = 1;
    const isOnlinePayment =
      paymentMethod.key === "MOMO" || paymentMethod.key === "VISA_MASTER";
    const paymentAmount = isOnlinePayment ? 0.0 : netPayable;

    const invoicePayload = {
      hoa_don: {
        ma_tk: maTaiKhoan,
        ma_chi_nhanh: maChiNhanh || FALLBACK_MA_CHI_NHANH,
        ma_kh: selectedCustomer?.maKh || null,
        ma_km:
          itemsVoucherDiscount.length > 0 ? itemsVoucherDiscount[0].maKm : null,
        ma_voucher_su_dung: null,
        ghi_chu: orderNote,
      },
      items: cartItems.map((item) => ({
        ma_sp: item.maSp,
        so_luong: item.quantity,
      })),
      payment: [
        {
          phuong_thuc: paymentMethod.key,
          so_tien: paymentAmount,
          ghi_chu: `Thanh toán qua ${paymentMethod.name}`,
        },
      ],
    };

    try {
      const response = await invoiceApi.createInvoice(invoicePayload);
      const result = response.data || response;

      if (result.payUrl) {
        setMomoPaymentUrl(result.payUrl);
      } else {
        toast.success("Thanh toán thành công!");
        onCheckoutSuccess?.(); // ✅ reset order ở Pos.jsx
        handleResetLocalForm();
      }
    } catch (error) {
      console.error("🚨 LỖI GỐC (Raw Error):", error);

      let finalMessage = "Đã có lỗi không xác định xảy ra.";
      if (error.response) {
        const data = error.response.data;
        if (typeof data === "string") finalMessage = data;
        else if (data?.message) finalMessage = data.message;
        else if (data?.error) finalMessage = data.error;
        else finalMessage = JSON.stringify(data);
      } else if (error.request) {
        finalMessage =
          "Không thể kết nối đến Server. Vui lòng kiểm tra Internet hoặc địa chỉ API.";
      } else {
        finalMessage = error.message;
      }

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
                  <Button
                    variant="light"
                    onClick={() => setIsShowModalAddCus(true)}
                  >
                    <PersonPlus size={18} />
                  </Button>
                </div>
              </Form.Group>
            )}

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
                        onClick={() => handleSelectCustomerLocal(customer)}
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
                {selectedCustomer
                  ? ` (${selectedCustomer.phanTramChietKhau}%)`
                  : ""}
              </Col>
              <Col className="text-end text-danger">
                -{formatCurrency(cartSummary.customerDiscountAmount || 0)}
              </Col>
            </Row>

            <Row className="mb-2 align-items-center">
              <Col className="d-flex align-items-center gap-2">
                <span>Chiết khấu KM</span>
              </Col>
              <Col className="text-end text-danger fw-semibold">
                -{formatCurrency(discount)}
              </Col>
            </Row>

            <Row className="mb-2 align-items-center">
              <Col className="d-flex align-items-center gap-2">
                <span>Mã KM</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                  onClick={() => setIsShowModalVoucher(!isShowModalVoucher)}
                >
                  <PlusSlashMinus size={14} />
                  <span>Thêm mã</span>
                </button>
              </Col>
              <Col className="text-end text-danger fw-semibold">
                -{formatCurrency(voucherDiscountTotal)}
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

            {paymentMethod.key === "CASH" ? (
              <>
                <Row className="mb-2">
                  <Col>Tiền khách đưa</Col>
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

      {/* MODAL chọn phương thức */}
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

          {paymentMethod.key !== "CASH" && (
            <div className="alert alert-info text-center">
              Xác nhận thanh toán <b>{formatCurrency(netPayable)}</b> qua{" "}
              <b>{paymentMethod.name}</b>.
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

      {/* MODAL MOMO */}
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
                // reset order ở Pos
                onCheckoutSuccess?.();
                handleResetLocalForm();
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

      <AddCustomer
        show={isShowModalAddCus}
        onClose={() => setIsShowModalAddCus(!isShowModalAddCus)}
        onSubmit={() => fetchCustomers("")}
      />

      <VoucherModal
        show={isShowModalVoucher}
        onClose={() => setIsShowModalVoucher(!isShowModalVoucher)}
        orderTotal={netPayable}
        onApply={(selectedVouchers) =>
          setItemsVoucherDiscount(selectedVouchers || [])
        }
      />
    </Col>
  );
};

export default PaymentCol;

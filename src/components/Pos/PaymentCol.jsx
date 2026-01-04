import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Col,
  Card,
  Button,
  Form,
  Row,
  Spinner,
  Modal,
  ListGroup,
  Badge,
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
  orderId,
  initialPaymentState,
  onPaymentStateChange,
  onCheckoutSuccess,
  onSelectCustomer,
  onCustomerDiscountChange,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [momoPaymentUrl, setMomoPaymentUrl] = useState(null);

  // Khởi tạo state từ props ban đầu
  const [paymentMethod, setPaymentMethod] = useState(() => {
    const key = initialPaymentState?.paymentMethodKey || "CASH";
    return PAYMENT_METHODS.find((m) => m.key === key) || PAYMENT_METHODS[0];
  });
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
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerSearchResults, setCustomerSearchResults] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isCustomerSearchFocused, setIsCustomerSearchFocused] = useState(false);
  const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
  const [isShowModalVoucher, setIsShowModalVoucher] = useState(false);

  // ✅ Dùng useRef để so sánh Deep Compare, tránh vòng lặp vô hạn
  const lastSyncedStateRef = useRef(null);

  // Hydrate lại state khi đổi đơn hàng (orderId thay đổi)
  useEffect(() => {
    const key = initialPaymentState?.paymentMethodKey || "CASH";
    const method =
      PAYMENT_METHODS.find((m) => m.key === key) || PAYMENT_METHODS[0];

    setPaymentMethod(method);
    setOrderNote(initialPaymentState?.orderNote || "");
    setItemsVoucherDiscount(initialPaymentState?.itemsVoucherDiscount || []);
    setSelectedCustomer(initialPaymentState?.selectedCustomer || null);

    // Reset các state UI cục bộ
    setCustomerPaidInput("");
    setCustomerSearchTerm("");
    setShowPaymentModal(false);
    setMomoPaymentUrl(null);

    // Cập nhật ref để khớp với state vừa nạp, tránh trigger persist ngược lại ngay lập tức
    lastSyncedStateRef.current = JSON.stringify({
      paymentMethodKey: key,
      orderNote: initialPaymentState?.orderNote || "",
      itemsVoucherDiscount: initialPaymentState?.itemsVoucherDiscount || [],
      selectedCustomer: initialPaymentState?.selectedCustomer || null,
    });
  }, [orderId]);

  const {
    totalAmount: rawTotalAmount = 0,
    discount: rawDiscount = 0,
    netPayable: rawNetPayable = 0,
  } = cartSummary;
  const totalAmount = toInt(rawTotalAmount);

  // Tính toán số tiền giảm thực tế từ Voucher
  const voucherDiscountTotal = useMemo(() => {
    return (itemsVoucherDiscount || []).reduce((sum, v) => {
      let val =
        v.loaiKm === "PERCENT"
          ? toInt((totalAmount * (v.giaTri || 0)) / 100)
          : toInt(v.giaTri || 0);
      if (
        v.loaiKm === "PERCENT" &&
        v.gioiHanTienGiamToiDa > 0 &&
        val > v.gioiHanTienGiamToiDa
      ) {
        val = v.gioiHanTienGiamToiDa;
      }
      return sum + val;
    }, 0);
  }, [itemsVoucherDiscount, totalAmount]);

  const netPayable = toInt(rawNetPayable - voucherDiscountTotal);
  const customerPaid = toInt(
    paymentMethod.key === "CASH"
      ? parseFloat(customerPaidInput) || 0
      : netPayable
  );
  const change = toInt(
    paymentMethod.key === "CASH" ? customerPaid - netPayable : 0
  );

  // Đồng bộ chiết khấu hạng khi khách hàng thay đổi
  useEffect(() => {
    const disc =
      selectedCustomer && selectedCustomer.phanTramChietKhau > 0
        ? toInt(
            Math.round((totalAmount * selectedCustomer.phanTramChietKhau) / 100)
          )
        : 0;
    onCustomerDiscountChange?.(disc);
  }, [selectedCustomer, totalAmount, onCustomerDiscountChange]);

  // ✅ FIX LỖI: Chỉ đẩy dữ liệu lên cha nếu có sự thay đổi thực tế
  useEffect(() => {
    const currentState = {
      paymentMethodKey: paymentMethod?.key,
      orderNote,
      itemsVoucherDiscount,
      selectedCustomer,
    };
    const currentStateStr = JSON.stringify(currentState);

    if (lastSyncedStateRef.current !== currentStateStr) {
      onPaymentStateChange?.(currentState);
      lastSyncedStateRef.current = currentStateStr;
    }
  }, [
    paymentMethod?.key,
    orderNote,
    itemsVoucherDiscount,
    selectedCustomer,
    onPaymentStateChange,
  ]);

  const fetchCustomers = useCallback(async (keyword) => {
    setCustomerLoading(true);
    try {
      const res = !keyword.trim()
        ? await khachHangApi.getAll()
        : await khachHangApi.search(keyword);
      setCustomerSearchResults(res || []);
    } catch (e) {
      setCustomerSearchResults([]);
    } finally {
      setCustomerLoading(false);
    }
  }, []);

  const debouncedFetch = useMemo(
    () => debounce(fetchCustomers, 300),
    [fetchCustomers]
  );

  const handleFinalizeOrder = async () => {
    if (netPayable <= 0) return alert("Tổng tiền phải lớn hơn 0 VND.");
    if (paymentMethod.key === "CASH" && customerPaid < netPayable)
      return handleShowPaymentModal();

    const user = getUserFromStorage();
    if (!user?.maTk) return alert("LỖI: Vui lòng đăng nhập lại.");

    setIsProcessing(true);
    try {
      const payload = {
        hoa_don: {
          ma_tk: user.maTk,
          ma_chi_nhanh: maChiNhanh || 1,
          ma_kh: selectedCustomer?.maKh || null,
          ma_km: itemsVoucherDiscount[0]?.maKm || null,
          ma_voucher_su_dung: itemsVoucherDiscount[0]?.maCode || null,
          ghi_chu: orderNote,
        },
        items: cartItems.map((it) => ({
          ma_sp: it.maSp,
          so_luong: it.quantity,
        })),
        payment: [
          {
            phuong_thuc: paymentMethod.key,
            so_tien: paymentMethod.key.includes("CASH") ? netPayable : 0.0,
            ghi_chu: `Qua ${paymentMethod.name}`,
          },
        ],
      };
      const res = await invoiceApi.createInvoice(payload);
      const data = res.data || res;
      if (data.payUrl) setMomoPaymentUrl(data.payUrl);
      else {
        toast.success("Thành công!");
        onCheckoutSuccess?.();
        handleResetLocalForm();
      }
    } catch (e) {
      alert(`Lỗi: ${e.response?.data?.message || e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetLocalForm = () => {
    setCustomerPaidInput("");
    setPaymentMethod(PAYMENT_METHODS[0]);
    setOrderNote("");
    setSelectedCustomer(null);
    setItemsVoucherDiscount([]);
    setMomoPaymentUrl(null);
    setShowPaymentModal(false);
  };

  const handleShowPaymentModal = () => {
    if (netPayable <= 0) return;
    if (paymentMethod.key === "CASH" && !customerPaidInput)
      setCustomerPaidInput(netPayable.toString());
    setShowPaymentModal(true);
  };

  return (
    <Col md={4} className="payment-col ps-2">
      <Card style={{ minHeight: "calc(100vh - 70px)" }} className="shadow-sm">
        <Card.Body>
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
                  onClick={() => setSelectedCustomer(null)}
                >
                  Xóa
                </Button>
              </div>
            ) : (
              <div className="input-group">
                <Form.Control
                  placeholder="Tìm khách hàng..."
                  value={customerSearchTerm}
                  onChange={(e) => {
                    setCustomerSearchTerm(e.target.value);
                    debouncedFetch(e.target.value);
                  }}
                  onFocus={() => {
                    setIsCustomerSearchFocused(true);
                    if (!customerSearchTerm) fetchCustomers("");
                  }}
                  onBlur={() =>
                    setTimeout(() => setIsCustomerSearchFocused(false), 200)
                  }
                />
                <Button
                  variant="light"
                  onClick={() => setIsShowModalAddCus(true)}
                >
                  <PersonPlus size={18} />
                </Button>
              </div>
            )}
            {isCustomerSearchFocused && !selectedCustomer && (
              <div
                className="list-group position-absolute w-100 shadow border mt-1"
                style={{ zIndex: 1001, maxHeight: "200px", overflowY: "auto" }}
              >
                {customerLoading ? (
                  <div className="p-2 text-center small">Đang tải...</div>
                ) : (
                  customerSearchResults.map((c) => (
                    <button
                      key={c.maKh}
                      className="list-group-item list-group-item-action small"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setCustomerSearchTerm("");
                      }}
                    >
                      <b>{c.hoTen}</b> - {c.sdt}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <hr />
          <div className="small">
            <div className="d-flex justify-content-between mb-1">
              <span>Tổng tiền:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="d-flex justify-content-between mb-1 text-danger">
              <span>Hạng ({selectedCustomer?.phanTramChietKhau || 0}%):</span>
              <span>
                -{formatCurrency(cartSummary.customerDiscountAmount || 0)}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center text-danger">
              <span className="d-flex align-items-center gap-1">
                Voucher
                {itemsVoucherDiscount[0] && (
                  <Badge bg="info" className="fw-normal">
                    {itemsVoucherDiscount[0].maCode}
                  </Badge>
                )}
                <PlusSlashMinus
                  className="text-primary cursor-pointer"
                  onClick={() => setIsShowModalVoucher(true)}
                />
              </span>
              <span>-{formatCurrency(voucherDiscountTotal)}</span>
            </div>
          </div>
          <hr />
          <h4 className="text-primary d-flex justify-content-between p-2 bg-light rounded shadow-sm">
            <span className="fs-6 align-self-center">KHÁCH PHẢI TRẢ</span>
            <span>{formatCurrency(netPayable)}</span>
          </h4>
          <div className="mt-3 small">
            <div className="d-flex justify-content-between">
              <span>Hình thức:</span>
              <b>
                {paymentMethod.icon} {paymentMethod.name}
              </b>
            </div>
            {paymentMethod.key === "CASH" && (
              <>
                <div className="d-flex justify-content-between mt-1">
                  <span>Khách đưa:</span>
                  <b>{formatCurrency(customerPaid)}</b>
                </div>
                <div className="d-flex justify-content-between mt-1 text-success">
                  <span>Tiền thừa:</span>
                  <b>{formatCurrency(change)}</b>
                </div>
              </>
            )}
          </div>
        </Card.Body>
        <Card.Footer className="bg-white border-0">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Ghi chú..."
            className="mb-3 small"
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
          />
          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              className="flex-fill"
              onClick={handleShowPaymentModal}
            >
              Hình thức
            </Button>
            <Button
              variant="primary"
              className="flex-fill fw-bold"
              onClick={handleFinalizeOrder}
              disabled={isProcessing}
            >
              {isProcessing ? <Spinner size="sm" /> : "THANH TOÁN"}
            </Button>
          </div>
        </Card.Footer>
      </Card>

      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
        size="sm"
      >
        <Modal.Body className="p-0">
          <div className="p-3 bg-primary text-white text-center rounded-top">
            <b>Phương thức thanh toán</b>
          </div>
          <div className="d-grid gap-2 p-3">
            {PAYMENT_METHODS.map((m) => (
              <Button
                key={m.key}
                variant={
                  paymentMethod.key === m.key ? "primary" : "outline-secondary"
                }
                className="text-start"
                onClick={() => {
                  setPaymentMethod(m);
                  if (m.key !== "CASH") setCustomerPaidInput("");
                }}
              >
                {m.icon} <span className="ms-2">{m.name}</span>
              </Button>
            ))}
            {paymentMethod.key === "CASH" && (
              <Form.Control
                type="number"
                className="mt-2"
                placeholder="Số tiền khách đưa"
                value={customerPaidInput}
                onChange={(e) => setCustomerPaidInput(e.target.value)}
              />
            )}
          </div>
          <div className="p-2 d-grid">
            <Button
              variant="primary"
              onClick={() => setShowPaymentModal(false)}
            >
              Xác nhận
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={!!momoPaymentUrl}
        onHide={() => setMomoPaymentUrl(null)}
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center p-4">
          <QrCode size={48} className="text-danger mb-3" />
          <h5>Thanh toán qua MoMo</h5>
          <p className="small text-muted">
            Vui lòng nhấp vào nút dưới để mở cổng thanh toán
          </p>
          <Button
            variant="danger"
            className="w-100 fw-bold"
            onClick={() => {
              window.open(momoPaymentUrl, "_blank");
              onCheckoutSuccess?.();
              handleResetLocalForm();
            }}
          >
            MỞ CỔNG THANH TOÁN
          </Button>
        </Modal.Body>
      </Modal>

      <AddCustomer
        show={isShowModalAddCus}
        onClose={() => setIsShowModalAddCus(false)}
        onSubmit={() => fetchCustomers("")}
      />
      <VoucherModal
        show={isShowModalVoucher}
        onClose={() => setIsShowModalVoucher(false)}
        orderTotal={totalAmount}
        onApply={(v) => setItemsVoucherDiscount(v || [])}
      />
    </Col>
  );
};

export default PaymentCol;

import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Spinner, Alert, Badge } from "react-bootstrap";
import khuyenMaiApi from "../../services/VoichersApi";

// Format tiền VND đơn giản
const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(n || 0)
  );

// parse yyyy-mm-dd -> Date (local)
const parseYMD = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0);
};

const isTodayInRange = (start, end) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const s = parseYMD(start);
  const e = parseYMD(end);

  if (s && today < s) return false;
  if (e && today > e) return false;
  return true;
};

// Check điều kiện và trả về {ok, reasons[]}
const checkVoucher = (v, orderTotal) => {
  const reasons = [];

  if (Number(v.trangThai) !== 1) reasons.push("Mã đang tạm ngưng");

  if (!isTodayInRange(v.ngayBatDau, v.ngayKetThuc)) {
    reasons.push(
      `Chỉ áp dụng từ ${v.ngayBatDau || "?"} đến ${v.ngayKetThuc || "?"}`
    );
  }

  const min = Number(v.giaTriDonHangToiThieu || 0);
  if (min > 0 && Number(orderTotal || 0) < min) {
    reasons.push(`Đơn tối thiểu ${formatVND(min)}`);
  }

  return { ok: reasons.length === 0, reasons };
};

export default function VoucherModal({
  show,
  onClose,
  onApply,
  orderTotal = 0, // 👈 tổng tiền đơn hàng
}) {
  const [vouchers, setVouchers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) return;

    (async () => {
      try {
        setError("");
        setLoading(true);

        const res = await khuyenMaiApi.getAll();
        const list = Array.isArray(res) ? res : res?.data || [];
        setVouchers(list);
      } catch (e) {
        setError(e?.message || "Không tải được danh sách mã khuyến mãi");
      } finally {
        setLoading(false);
      }
    })();
  }, [show]);

  // map voucher -> status check
  const voucherView = useMemo(() => {
    return vouchers.map((v) => {
      const { ok, reasons } = checkVoucher(v, orderTotal);
      return { ...v, ok, reasons };
    });
  }, [vouchers, orderTotal]);

  const toggleSelect = (maKm) => {
    setSelectedIds((prev) => (prev[0] === maKm ? [] : [maKm]));
  };


  const handleApply = () => {
    const selected = voucherView.filter((v) => selectedIds.includes(v.maKm) && v.ok);

    // trả về list mã đã chọn để bạn tính discount ở cha
    onApply?.(selected);
    onClose?.();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Chọn mã giảm giá</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error ? <Alert variant="danger">{error}</Alert> : null}

        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <div className="fw-semibold">Tổng đơn hàng:</div>
            <div className="text-primary fw-bold">{formatVND(orderTotal)}</div>
          </div>

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setSelectedIds([])}
            disabled={loading}
          >
            <i className="bi bi-arrow-counterclockwise me-1" />
            Bỏ chọn
          </Button>
        </div>

        {loading ? (
          <div className="py-4 text-center">
            <Spinner />
          </div>
        ) : voucherView.length === 0 ? (
          <div className="text-muted">Chưa có mã khuyến mãi.</div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {voucherView.map((v) => {
              const checked = selectedIds.includes(v.maKm);

              // label hiển thị giá trị
              const valueLabel =
                v.loaiKm === "PERCENT"
                  ? `${Number(v.giaTri || 0)}%`
                  : formatVND(v.giaTri);

              return (
                <div
                  key={v.maKm}
                  className={`border rounded-3 p-3 ${
                    v.ok ? "bg-white" : "bg-light"
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex gap-2">
                      <Form.Check
                        type="checkbox"
                        checked={checked}
                        disabled={!v.ok}
                        onChange={() => toggleSelect(v.maKm)}
                      />

                      <div>
                        <div className="fw-bold d-flex align-items-center gap-2">
                          <span>{v.maCode}</span>
                          {v.ok ? (
                            <Badge bg="success">Hợp lệ</Badge>
                          ) : (
                            <Badge bg="secondary">Không đủ điều kiện</Badge>
                          )}
                        </div>

                        <div className="text-muted">{v.tenKm}</div>

                        <div className="small mt-1">
                          <span className="me-2">
                            <i className="bi bi-tag me-1" />
                            Giảm: <strong>{valueLabel}</strong>
                          </span>

                          {Number(v.giaTriDonHangToiThieu || 0) > 0 ? (
                            <span className="me-2">
                              <i className="bi bi-cash-coin me-1" />
                              Tối thiểu:{" "}
                              <strong>{formatVND(v.giaTriDonHangToiThieu)}</strong>
                            </span>
                          ) : null}

                          {Number(v.gioiHanTienGiamToiDa || 0) > 0 ? (
                            <span>
                              <i className="bi bi-shield-check me-1" />
                              Giảm tối đa:{" "}
                              <strong>{formatVND(v.gioiHanTienGiamToiDa)}</strong>
                            </span>
                          ) : null}
                        </div>

                        {!v.ok ? (
                          <div className="mt-2 small text-danger">
                            <i className="bi bi-exclamation-circle me-1" />
                            Thiếu điều kiện: {v.reasons.join(" • ")}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="small text-muted">Hiệu lực</div>
                      <div className="small">
                        {v.ngayBatDau} → {v.ngayKetThuc}
                      </div>
                    </div>
                  </div>

                  {v.moTa ? <div className="mt-2 small text-muted">{v.moTa}</div> : null}
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleApply} disabled={loading}>
          Áp dụng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

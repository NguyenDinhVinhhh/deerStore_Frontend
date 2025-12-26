// components/Dashboard/StatCards.jsx
import { Row, Col, Spinner } from "react-bootstrap";
import {
  FaMoneyBillWave,
  FaClipboardList,
  FaUndo,
  FaTimesCircle,
} from "react-icons/fa";
import { formatVND } from "../../utils/formatUtils";

const StatItem = ({ icon, label, value, color, isLast }) => (
  <Col
    md={3}
    sm={6}
    className={!isLast ? "border-end border-light-subtle" : ""}
  >
    <div className="d-flex align-items-center justify-content-center gap-3 py-2">
      <div
        className="p-3 rounded-circle bg-body-secondary"
        style={{
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div className="text-start">
        <div className="text-muted small mb-0 fw-medium">{label}</div>
        <div className={`h5 mb-0 fw-bold ${color}`}>{value}</div>
      </div>
    </div>
  </Col>
);

export default function StatCards({ summary, loading }) {
  if (loading)
    return (
      <div className="text-center py-4">
        <Spinner animation="border" size="sm" />
      </div>
    );

  return (
    <Row className="text-center g-0">
      <StatItem
        icon={<FaMoneyBillWave color="#3b82f6" size={22} />}
        label="Doanh thu"
        value={formatVND(summary?.tongDoanhThu || 0)}
        color="text-primary"
      />
      <StatItem
        icon={<FaClipboardList color="#10b981" size={22} />}
        label="Đơn hàng mới"
        value={summary?.tongDonHangMoi || 0}
        color="text-success"
      />
      <StatItem
        icon={<FaUndo color="#f59e0b" size={22} />}
        label="Đơn trả hàng"
        value={summary?.tongDonTraHang || 0}
        color="text-warning"
      />
      <StatItem
        icon={<FaTimesCircle color="#ef4444" size={22} />}
        label="Đơn hủy"
        value={summary?.tongDonHuy || 0}
        color="text-danger"
        isLast={true}
      />
    </Row>
  );
}

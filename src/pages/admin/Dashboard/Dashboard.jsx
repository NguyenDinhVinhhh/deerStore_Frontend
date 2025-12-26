import React, { useState } from "react";
import { Card, Form, Nav } from "react-bootstrap";
import { useDashboardSummary } from "../../../hooks/use-dashboard";
import { useBranch } from "../../../hooks/use-branchs";
import { useRevenueStats } from "../../../hooks/use-revenue-stats";
import { useBranchComparison } from "../../../hooks/use-branch-comparison";
import { formatVND } from "../../../utils/formatUtils";
import StatCards from "../../../components/admin/StatCards";
import RevenueChart from "../../../components/admin/RevenueChart";

export default function Dashboard() {
  const [headerBranch, setHeaderBranch] = useState("all");
  const [chartBranch, setChartBranch] = useState("all");
  const [timeRange, setTimeRange] = useState("BAY_NGAY_QUA");
  const [tab, setTab] = useState("revenue");

  const { data: branches = [] } = useBranch();
  const { data: summary, isLoading: loadingSum } =
    useDashboardSummary(headerBranch);

  // Gọi dữ liệu tùy theo tab đang chọn
  const { data: barData = [], isLoading: loadingBar } = useRevenueStats(
    timeRange,
    chartBranch
  );
  const { data: pieData = [], isLoading: loadingPie } =
    useBranchComparison(timeRange);

  const isRevenueTab = tab === "revenue";
  const chartData = isRevenueTab ? barData : pieData;
  const totalRevenue = chartData.reduce(
    (sum, item) => sum + (item.value || item.doanhThu || 0),
    0
  );

  return (
    <div className="p-4 bg-light min-vh-100">
      {/* KHỐI CHỈ SỐ: KẾT QUẢ KINH DOANH TRONG NGÀY */}
      <Card className="border-0 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h6 className="fw-bold mb-0 text-secondary">
            KẾT QUẢ KINH DOANH TRONG NGÀY
          </h6>
          <Form.Select
            size="sm"
            style={{ width: "220px" }}
            value={headerBranch}
            onChange={(e) => setHeaderBranch(e.target.value)}
          >
            <option value="all">Tất cả chi nhánh</option>
            {branches.map((b) => (
              <option key={b.maChiNhanh} value={b.maChiNhanh}>
                {b.tenChiNhanh}
              </option>
            ))}
          </Form.Select>
        </div>
        <Card.Body>
          <StatCards summary={summary} loading={loadingSum} />
        </Card.Body>
      </Card>

      {/* KHỐI BIỂU ĐỒ: DOANH THU & TỶ TRỌNG */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom flex-wrap gap-3">
            <Nav
              variant="tabs"
              activeKey={tab}
              onSelect={setTab}
              className="border-0"
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="revenue"
                  className={`fw-bold py-3 ${
                    isRevenueTab
                      ? "text-primary border-bottom border-primary border-3"
                      : "text-secondary"
                  }`}
                >
                  DOANH THU BÁN HÀNG
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="ratio"
                  className={`fw-bold py-3 ${
                    tab === "ratio"
                      ? "text-primary border-bottom border-primary border-3"
                      : "text-secondary"
                  }`}
                >
                  TỶ TRỌNG BÁN HÀNG
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <div className="d-flex gap-2 pb-2">
              {/* Ẩn bộ lọc chi nhánh khi xem Tỷ trọng (so sánh liên chi nhánh) */}
              {isRevenueTab && (
                <Form.Select
                  size="sm"
                  style={{ width: "180px" }}
                  value={chartBranch}
                  onChange={(e) => setChartBranch(e.target.value)}
                >
                  <option value="all">Tất cả chi nhánh</option>
                  {branches.map((b) => (
                    <option key={b.maChiNhanh} value={b.maChiNhanh}>
                      {b.tenChiNhanh}
                    </option>
                  ))}
                </Form.Select>
              )}
              <Form.Select
                size="sm"
                style={{ width: "150px" }}
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="HOM_NAY">Hôm nay</option>
                <option value="HOM_QUA">Hôm qua</option>
                <option value="BAY_NGAY_QUA">7 ngày qua</option>
                <option value="THANG_NAY">Tháng này</option>
                <option value="NAM_NAY">Năm nay</option>
              </Form.Select>
            </div>
          </div>

          <RevenueChart
            tab={tab}
            data={chartData}
            loading={isRevenueTab ? loadingBar : loadingPie}
          />

          <div className="text-center mt-1 border-top pt-3">
            <span className="text-muted small fw-bold text-uppercase">
              TỔNG DOANH THU:{" "}
            </span>
            <span className="fw-bold fs-4 text-dark ms-2">
              {formatVND(totalRevenue)}
            </span>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

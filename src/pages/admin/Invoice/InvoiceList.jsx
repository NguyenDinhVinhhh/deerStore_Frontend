import React, { useState } from "react";
import {
  Table,
  Card,
  Button,
  Form,
  Row,
  Col,
  Badge,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { useInvoices } from "../../../hooks/use-invoices";
import { useBranch } from "../../../hooks/use-branchs";
import { formatVND } from "../../../utils/formatUtils";
import {
  FaEye,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaEraser,
} from "react-icons/fa";
import moment from "moment";

export default function InvoiceList() {
  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    maChiNhanh: "",
    trangThai: "",
    startDate: "", // Trường ngày bắt đầu
    endDate: "", // Trường ngày kết thúc
  });

  const { data: branches = [] } = useBranch();

  // Logic xử lý format ngày trước khi gửi lên hook (API)
  const apiFilters = {
    ...filters,
    start: filters.startDate ? `${filters.startDate}T00:00:00` : "",
    end: filters.endDate ? `${filters.endDate}T23:59:59` : "",
  };

  const { data: invoiceData, isLoading } = useInvoices(apiFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const resetFilters = () => {
    setFilters({
      page: 0,
      size: 10,
      maChiNhanh: "",
      trangThai: "",
      startDate: "",
      endDate: "",
    });
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s?.includes("HOAN THANH"))
      return <Badge bg="success">Hoàn thành</Badge>;
    if (s?.includes("CHỜ THANH TOÁN"))
      return (
        <Badge bg="warning" text="dark">
          Chờ thanh toán
        </Badge>
      );
    if (s?.includes("HỦY")) return <Badge bg="danger">Đã hủy</Badge>;
    return <Badge bg="secondary">{status}</Badge>;
  };

  return (
    <div className="p-4 bg-light min-vh-100">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={2}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">
                  Chi nhánh
                </Form.Label>
                <Form.Select
                  name="maChiNhanh"
                  value={filters.maChiNhanh}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả chi nhánh</option>
                  {branches.map((b) => (
                    <option key={b.maChiNhanh} value={b.maChiNhanh}>
                      {b.tenChiNhanh}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">
                  Trạng thái
                </Form.Label>
                <Form.Select
                  name="trangThai"
                  value={filters.trangThai}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="HOAN THANH">Hoàn thành</option>
                  <option value="Chờ thanh toán">Chờ thanh toán</option>
                  <option value="Chờ thanh toán Online">
                    Chờ thanh toán Online
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* BỘ LỌC NGÀY THÁNG */}
            <Col md={2}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">
                  Từ ngày
                </Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">
                  Đến ngày
                </Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={4} className="d-flex align-items-end justify-content-end">
              <Button
                variant="outline-primary"
                onClick={resetFilters}
                className="d-flex align-items-center"
              >
                <FaEraser className="me-2" /> Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Table hover responsive className="align-middle mb-0 text-nowrap">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 text-muted">MÃ HĐ</th>
                    <th className="text-muted">NGÀY LẬP</th>
                    <th className="text-muted">CHI NHÁNH</th>
                    <th className="text-muted">TỔNG TIỀN</th>
                    <th className="text-muted text-center">TRẠNG THÁI</th>
                    <th className="text-center text-muted">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData?.content?.map((item) => (
                    <tr key={item.maHoaDon}>
                      <td className="ps-4 fw-bold">#{item.maHoaDon}</td>
                      <td>
                        <div className="small text-muted">
                          <FaCalendarAlt className="me-1 opacity-50" />
                          {moment(item.ngayLap).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </td>
                      <td>
                        {branches.find((b) => b.maChiNhanh === item.maChiNhanh)
                          ?.tenChiNhanh || `CN ${item.maChiNhanh}`}
                      </td>
                      <td className="fw-bold">{formatVND(item.thanhTien)}</td>
                      <td className="text-center">
                        {getStatusBadge(item.trangThai)}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="light"
                          size="sm"
                          className="text-primary hover-shadow"
                        >
                          <FaEye className="me-1" /> Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center p-3 border-top bg-white">
                <div className="small text-muted">
                  Hiển thị <b>{invoiceData?.numberOfElements || 0}</b> /{" "}
                  <b>{invoiceData?.totalElements || 0}</b> đơn hàng
                </div>
                <Pagination size="sm" className="mb-0">
                  <Pagination.First
                    onClick={() => handlePageChange(0)}
                    disabled={invoiceData?.first}
                  />
                  <Pagination.Prev
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={invoiceData?.first}
                  />
                  {[...Array(invoiceData?.totalPages || 0).keys()].map((p) => (
                    <Pagination.Item
                      key={p}
                      active={p === filters.page}
                      onClick={() => handlePageChange(p)}
                    >
                      {p + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={invoiceData?.last}
                  />
                  <Pagination.Last
                    onClick={() =>
                      handlePageChange((invoiceData?.totalPages || 1) - 1)
                    }
                    disabled={invoiceData?.last}
                  />
                </Pagination>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import {
  Table,
  Card,
  Button,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Modal,
} from "react-bootstrap";
import {
  FaWarehouse,
  FaPlusCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit,
  FaSearch,
} from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import inventoryApi from "../../../services/inventoryApi";
import { useBranch } from "../../../hooks/use-branchs";
import { toast } from "react-toastify";

export default function Inventory() {
  const queryClient = useQueryClient();

  // State quản lý lựa chọn và tìm kiếm
  const [selectedBranch, setSelectedBranch] = useState("");
  const [activeWarehouse, setActiveWarehouse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // State quản lý Modal thiết lập
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);

  // 1. Lấy danh sách Chi nhánh cho Dropdown
  const { data: branches = [] } = useBranch();

  // 2. Hook tự động lấy Kho hàng khi mã chi nhánh thay đổi
  const { isFetching: isGettingWarehouse } = useQuery({
    queryKey: ["warehouse-by-branch", selectedBranch],
    queryFn: async () => {
      const res = await inventoryApi.getWarehousesByBranch(selectedBranch);
      // Giả định mỗi chi nhánh có 1 kho hàng duy nhất
      if (res && res.length > 0) {
        setActiveWarehouse(res[0]);
      } else {
        setActiveWarehouse(null);
      }
      return res;
    },
    enabled: !!selectedBranch,
  });

  // 3. Hook lấy trạng thái tồn kho từ mã kho (ví dụ: 101)
  const { data: inventoryData = [], isLoading: loadingInv } = useQuery({
    queryKey: ["inventory-status", activeWarehouse?.maKho],
    queryFn: () => inventoryApi.getInventoryWithStatus(activeWarehouse.maKho),
    enabled: !!activeWarehouse?.maKho,
    staleTime: 30000, // Giảm tần suất gọi lại API nếu dữ liệu ít thay đổi
  });

  // Lọc dữ liệu hiển thị dựa trên ô tìm kiếm
  const filteredProducts = useMemo(() => {
    return inventoryData.filter(
      (item) =>
        item.tenSp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.maSku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventoryData, searchTerm]);

  // 4. Xử lý lưu thiết lập ban đầu (POST)
  const handleConfirmSetup = async () => {
    if (quantity < 0) return toast.error("Số lượng không thể âm");

    try {
      const payload = {
        maSp: currentProduct.maSp,
        maKho: activeWarehouse.maKho, // Sử dụng maKho thực tế từ API kho
        soLuongTon: parseInt(quantity),
        ghiChu: "Thiết lập tồn kho ban đầu",
      };

      await inventoryApi.setupInitialStock(payload);
      toast.success("Thiết lập tồn kho thành công!");

      // Refresh lại danh sách để cập nhật trạng thái "Đã thiết lập"
      queryClient.invalidateQueries([
        "inventory-status",
        activeWarehouse.maKho,
      ]);
      setShowModal(false);
    } catch (error) {
      // Hiển thị lỗi từ Backend (Ví dụ: 400 - Đã tồn tại)
      toast.error(error.response?.data?.message || "Lỗi thiết lập hệ thống");
    }
  };

  return (
    <div className="p-4 bg-light min-vh-100">
      {/* THANH ĐIỀU KHIỂN */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Label className="small fw-bold text-muted">
                CHỌN CHI NHÁNH
              </Form.Label>
              <Form.Select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setActiveWarehouse(null); // Reset kho để chờ API kho mới
                }}
                className="border-primary"
              >
                <option value="">-- Chọn chi nhánh quản lý --</option>
                {branches.map((b) => (
                  <option key={b.maChiNhanh} value={b.maChiNhanh}>
                    {b.tenChiNhanh}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={5}>
              <Form.Label className="small fw-bold text-muted">
                TÌM SẢN PHẨM
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <Form.Control
                  className="border-start-0 ps-0"
                  placeholder="Nhập tên sản phẩm hoặc SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            {activeWarehouse && (
              <Col className="text-end">
                <Badge bg="info" className="p-2 fw-normal rounded-pill">
                  Kho: {activeWarehouse.tenKho} (ID: {activeWarehouse.maKho})
                </Badge>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* DANH SÁCH DỮ LIỆU */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr>
                <th className="ps-4 py-3">Sản phẩm / SKU</th>
                <th>Trạng thái tồn</th>
                <th>Tồn kho thực tế</th>
                <th className="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {!selectedBranch ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-5 text-muted small italic"
                  >
                    Vui lòng chọn chi nhánh để xem danh sách sản phẩm
                  </td>
                </tr>
              ) : loadingInv || isGettingWarehouse ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="sm" />
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <tr key={item.maSp}>
                    <td className="ps-4">
                      <div className="fw-bold">{item.tenSp}</div>
                      <div className="small text-muted">{item.maSku}</div>
                    </td>
                    <td>
                      {item.daThietLapTonKho ? (
                        <Badge bg="success" className="px-3 rounded-pill">
                          <FaCheckCircle className="me-1" /> Đã thiết lập
                        </Badge>
                      ) : (
                        <Badge
                          bg="warning"
                          text="dark"
                          className="px-3 rounded-pill"
                        >
                          <FaExclamationCircle className="me-1" /> Chưa thiết
                          lập
                        </Badge>
                      )}
                    </td>
                    <td className="fw-bold fs-5 text-primary">
                      {item.soLuongTon}
                    </td>
                    <td className="text-end pe-4">
                      {!item.daThietLapTonKho ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-pill px-3 shadow-sm"
                          onClick={() => {
                            setCurrentProduct(item);
                            setQuantity(0);
                            setShowModal(true);
                          }}
                        >
                          <FaPlusCircle className="me-1" /> Thiết lập
                        </Button>
                      ) : (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill px-3"
                        >
                          <FaEdit className="me-1" /> Điều chỉnh
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted small">
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* MODAL THIẾT LẬP */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-primary text-white py-2">
          <Modal.Title className="fs-6 text-uppercase">
            Khởi tạo tồn kho ban đầu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <h6 className="mb-3 text-dark fw-bold">{currentProduct?.tenSp}</h6>
          <Form.Group>
            <Form.Label className="small fw-bold text-muted d-block mb-3">
              NHẬP SỐ LƯỢNG (TẠI KHO ID: {activeWarehouse?.maKho})
            </Form.Label>
            <Form.Control
              type="number"
              className="form-control-lg text-center fw-bold border-primary shadow-none"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <div className="mt-3 small text-muted italic">
            Lưu ý: Bạn chỉ có thể thiết lập con số này một lần duy nhất.
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center pb-4">
          <Button
            variant="light"
            className="px-4"
            onClick={() => setShowModal(false)}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            className="px-4 shadow-sm"
            onClick={handleConfirmSetup}
          >
            Xác nhận lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

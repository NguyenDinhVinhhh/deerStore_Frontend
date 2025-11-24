import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Container,
  Button,
  Form,
  Navbar,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import {
  Plus,
  Grid3x3,
  House,
  Gear,
  Search,
  Printer,
  Display,
  GeoAlt,
} from "react-bootstrap-icons";
import inventoryApi from "../../services/inventoryApi";
import warehouseApi from "../../services/warehouseApi";

const formatCurrency = (amount) => {
  if (amount == null) return "N/A";
  const numericAmount =
    typeof amount === "number" ? amount : parseFloat(amount);
  if (isNaN(numericAmount)) return "0₫";

  return new Intl.NumberFormat("vi-VN").format(numericAmount) + "₫";
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

const PosNavbar = ({ onAddItemToCart, onNewOrder, onBranchChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [warehouseLoading, setWarehouseLoading] = useState(false);

  const fetchWarehouseByBranch = useCallback(async (maChiNhanh) => {
    if (!maChiNhanh) return;

    setWarehouseLoading(true);
    setSelectedWarehouseId(null);
    setSearchResults([]);

    try {
      const response = await warehouseApi.getByMaChiNhanh(maChiNhanh);
      const warehouseList = response || [];

      if (warehouseList.length > 0) {
        const firstWarehouseId = warehouseList[0].maKho;
        setSelectedWarehouseId(firstWarehouseId);
      } else {
        setSelectedWarehouseId(null);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kho hàng:", error);
      setSelectedWarehouseId(null);
    } finally {
      setWarehouseLoading(false);
    }
  }, []);

  // Tác dụng phụ 1: Load danh sách chi nhánh và tìm kho hàng ban đầu
  useEffect(() => {
    const chiNhanhListJson = localStorage.getItem("chiNhanhList");
    if (chiNhanhListJson) {
      try {
        const list = JSON.parse(chiNhanhListJson);
        setBranches(list);

        if (list.length > 0) {
          const defaultBranch = list[0];
          setSelectedBranch(defaultBranch);
          fetchWarehouseByBranch(defaultBranch.maChiNhanh);

          // 🔥 ĐIỂM SỬA 1: TRUYỀN MÃ CHI NHÁNH MẶC ĐỊNH LÊN POSSCREEN KHI KHỞI TẠO
          if (onBranchChange) {
            onBranchChange(defaultBranch.maChiNhanh);
          }
        }
      } catch (e) {
        console.error("Lỗi khi parsing chiNhanhList từ localStorage:", e);
      }
    }
  }, [fetchWarehouseByBranch, onBranchChange]); // Thêm onBranchChange vào dependency

  // Tác dụng phụ 2: Reset kết quả tìm kiếm và tải lại mặc định khi kho hàng thay đổi (Giữ nguyên)
  useEffect(() => {
    if (selectedWarehouseId !== null) {
      setSearchTerm("");
      setSearchResults([]);

      if (isFocused) {
        fetchProducts("");
      }
    }
  }, [selectedWarehouseId, isFocused]);

  // Hàm xử lý khi chọn chi nhánh
  const handleChangeBranch = (branch) => {
    setSelectedBranch(branch);

    // 🔥 ĐIỂM SỬA 2: TRUYỀN MÃ CHI NHÁNH MỚI LÊN POSSCREEN
    if (onBranchChange) {
      onBranchChange(branch.maChiNhanh); // Truyền maChiNhanh
    }

    // Reset trạng thái tìm kiếm ngay lập tức
    setSearchTerm("");
    setSearchResults([]);
    fetchWarehouseByBranch(branch.maChiNhanh);
  };

  // ... (fetchProducts, debouncedFetch, handleInputChange, handleInputFocus, handleInputBlur giữ nguyên)
  const fetchProducts = useCallback(
    async (query) => {
      if (selectedWarehouseId === null || warehouseLoading) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        let response;
        if (!query.trim()) {
          response = await inventoryApi.getInventoryByWarehouse(
            selectedWarehouseId
          );
        } else {
          response = await inventoryApi.searchInventory(
            query,
            selectedWarehouseId,
            10
          );
        }
        setSearchResults(response || []);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [selectedWarehouseId, warehouseLoading]
  );

  const debouncedFetch = useCallback(debounce(fetchProducts, 300), [
    fetchProducts,
  ]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetch(value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (
      !searchTerm &&
      searchResults.length === 0 &&
      selectedWarehouseId !== null &&
      !loading
    ) {
      fetchProducts("");
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  // Sửa lại hàm handleSelectProduct để kiểm tra tồn kho ban đầu (Giữ nguyên)
  const handleSelectProduct = (inventoryItem) => {
    const soLuongTon = inventoryItem.soLuongTon || 0;

    // KIỂM TRA TỒN KHO BẰNG 0
    if (soLuongTon <= 0) {
      alert(
        "Sản phẩm này hiện đã hết hàng (Tồn: 0) và không thể thêm vào đơn."
      );
      return; // Không cho phép thêm
    }

    const productToAdd = {
      maSp: inventoryItem.sanPham.maSp,
      tenSp: inventoryItem.sanPham.tenSp,
      maSku: inventoryItem.sanPham.maSku,
      donGia: inventoryItem.sanPham.donGia,
      soLuongTon: soLuongTon, // Truyền tồn kho đi
      quantity: 1,
    };

    onAddItemToCart(productToAdd);
    setSearchTerm("");
    setSearchResults([]);
  };

  // ... (Phần JSX giữ nguyên)
  const showResults =
    (isFocused || searchTerm) &&
    (searchResults.length > 0 || loading || warehouseLoading);

  const searchDisabled = selectedWarehouseId === null || warehouseLoading;

  return (
    <Navbar
      variant="dark"
      className="p-0"
      style={{
        backgroundColor: "#1e63a3",
        borderBottom: "2px solid #0d4a7c",
      }}
    >
      <Container fluid className="px-0">
        <div className="d-flex align-items-stretch w-100">
          {/* KHU VỰC 1: THANH TÌM KIẾM SẢN PHẨM & KẾT QUẢ */}
          <div
            className="d-flex align-items-center p-2"
            style={{
              backgroundColor: "#2f74bf",
              width: "45%",
              position: "relative",
            }}
          >
            <Form
              className="d-flex flex-grow-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="input-group">
                <span
                  className="input-group-text bg-white border-0"
                  style={{ borderRight: "none" }}
                >
                  <Search size={18} className="text-muted" />
                </span>
                <Form.Control
                  ref={searchInputRef}
                  type="search"
                  placeholder={
                    warehouseLoading
                      ? "Đang tải kho hàng..."
                      : searchDisabled
                      ? "Không tìm thấy kho hàng"
                      : "Thêm sản phẩm vào đơn"
                  }
                  aria-label="Search"
                  className="py-2"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  disabled={searchDisabled}
                  style={{ borderLeft: "none", minWidth: "200px" }}
                />
              </div>
            </Form>

            {/* HIỂN THỊ KẾT QUẢ TÌM KIẾM DƯỚI DẠNG DROPDOWN OVERLAY */}
            {isFocused && !searchDisabled && (
              <div
                className="list-group position-absolute w-100 shadow-lg border"
                style={{
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {loading || warehouseLoading ? (
                  <div className="list-group-item text-center">
                    <Spinner animation="border" size="sm" className="me-2" />{" "}
                    Đang tải{warehouseLoading ? " kho hàng..." : " sản phẩm..."}
                  </div>
                ) : searchResults.length === 0 && searchTerm === "" ? (
                  <div className="list-group-item text-center text-muted">
                    Bắt đầu nhập tên hoặc SKU để tìm kiếm...
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.sanPham.maSp}
                      type="button"
                      className="list-group-item list-group-item-action py-2"
                      onClick={() => handleSelectProduct(item)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div
                            className="fw-bold text-truncate"
                            style={{ maxWidth: "250px" }}
                          >
                            {item.sanPham.tenSp}
                          </div>
                          <small className="text-muted">
                            {item.sanPham.maSku}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success">
                            {formatCurrency(item.sanPham.donGia)}
                          </div>
                          <small className="text-secondary">
                            Tồn: {item.soLuongTon}
                          </small>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* THÔNG BÁO NẾU KHÔNG TÌM THẤY KHO HÀNG */}
            {searchDisabled && !warehouseLoading && (
              <div
                className="list-group position-absolute w-100 shadow-lg border"
                style={{
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                }}
              >
                <div className="list-group-item text-center text-danger">
                  Không tìm thấy kho hàng cho chi nhánh này.
                </div>
              </div>
            )}
          </div>
          {/* KHU VỰC 2 & 3 */}
          <div className="d-flex align-items-center flex-grow-1">
            <Dropdown className="h-100">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-f10"
                className="h-100 d-flex align-items-center text-dark py-2 px-3 fw-bold"
                style={{
                  borderRadius: 0,
                  borderTop: "none",
                  borderBottom: "none",
                }}
              >
                <Printer size={16} className="me-1" />{" "}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">In Hóa đơn</Dropdown.Item>
                <Dropdown.Item href="#/action-2">In Tạm tính</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <span className="text-dark me-2 ms-3 fw-bold">Đơn 1</span>

            <Button
              variant="light"
              size="sm"
              className="me-4 border-0 text-primary"
              onClick={onNewOrder}
            >
              <Plus size={18} />
            </Button>

            <div
              className="d-flex align-items-center text-white ms-auto h-100 px-3"
              style={{ backgroundColor: "#1e63a3" }}
            >
              <Dropdown align="end" className="me-3">
                <Dropdown.Toggle
                  variant="link"
                  className="text-white p-0 text-decoration-none shadow-none border-0"
                  id="dropdown-branch-selector"
                  disabled={branches.length <= 1 || warehouseLoading}
                >
                  <div className="text-end" style={{ fontSize: "0.8rem" }}>
                    <div className="d-flex align-items-center justify-content-end">
                      <GeoAlt size={12} className="me-1" />{" "}
                      <div
                        className="fw-bold text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        {warehouseLoading
                          ? "Đang tải kho..."
                          : selectedBranch
                          ? selectedBranch.tenChiNhanh
                          : "Đang tải..."}
                      </div>
                    </div>
                  </div>
                </Dropdown.Toggle>

                {branches.length > 1 && (
                  <Dropdown.Menu align="end">
                    <Dropdown.Header>Chọn Chi Nhánh Làm Việc</Dropdown.Header>
                    {branches.map((branch) => (
                      <Dropdown.Item
                        key={branch.maChiNhanh}
                        active={
                          selectedBranch &&
                          selectedBranch.maChiNhanh === branch.maChiNhanh
                        }
                        onClick={() => handleChangeBranch(branch)}
                      >
                        <div className="fw-bold">{branch.tenChiNhanh}</div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                )}
              </Dropdown>
              <Display
                size={20}
                className="mx-2"
                style={{ cursor: "pointer" }}
              />{" "}
              <Grid3x3
                size={20}
                className="mx-2"
                style={{ cursor: "pointer" }}
              />
              <House size={20} className="mx-2" style={{ cursor: "pointer" }} />
              <Gear
                size={20}
                className="ms-2 me-3"
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default PosNavbar;

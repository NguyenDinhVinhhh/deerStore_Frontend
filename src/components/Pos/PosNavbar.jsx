// PosNavbar.jsx
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
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
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const PosNavbar = ({
  onAddItemToCart,
  onNewOrder,
  onBranchChange,
  orders = [],
  activeOrderId,
  onSwitchOrder,
  selectedMaChiNhanh,
  onCloseOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [warehouseLoading, setWarehouseLoading] = useState(false);

  // ✅ NEW: đã load default list chưa? (để focus là list ra ngay)
  const [hasLoadedDefault, setHasLoadedDefault] = useState(false);

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeOrderId),
    [orders, activeOrderId]
  );

  const fetchWarehouseByBranch = useCallback(async (maChiNhanh) => {
    if (!maChiNhanh) return;

    setWarehouseLoading(true);
    setSelectedWarehouseId(null);

    // reset search state khi đổi kho
    setSearchTerm("");
    setSearchResults([]);
    setHasLoadedDefault(false);

    try {
      const response = await warehouseApi.getByMaChiNhanh(maChiNhanh);
      const warehouseList = response || [];

      if (warehouseList.length > 0) {
        setSelectedWarehouseId(warehouseList[0].maKho);
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

  // load branches + set default
  useEffect(() => {
    const chiNhanhListJson = localStorage.getItem("chiNhanhList");
    if (!chiNhanhListJson) return;

    try {
      const list = JSON.parse(chiNhanhListJson);
      setBranches(list);
      if (!list.length) return;

      const branchFromPos = selectedMaChiNhanh
        ? list.find((b) => b.maChiNhanh === selectedMaChiNhanh)
        : null;

      const initialBranch = branchFromPos || list[0];

      setSelectedBranch(initialBranch);
      fetchWarehouseByBranch(initialBranch.maChiNhanh);

      // chỉ gọi onBranchChange nếu Pos chưa có selectedMaChiNhanh
      if (!selectedMaChiNhanh && onBranchChange) {
        onBranchChange(initialBranch.maChiNhanh);
      }
    } catch (e) {
      console.error("Lỗi parse chiNhanhList:", e);
    }
  }, [fetchWarehouseByBranch, onBranchChange, selectedMaChiNhanh]);

  // sync branch theo order/pos
  useEffect(() => {
    if (!branches.length) return;

    const ma =
      activeOrder?.maChiNhanh ??
      selectedMaChiNhanh ??
      selectedBranch?.maChiNhanh;
    if (!ma) return;

    const nextBranch = branches.find((b) => b.maChiNhanh === ma);
    if (!nextBranch) return;

    if (
      !selectedBranch ||
      selectedBranch.maChiNhanh !== nextBranch.maChiNhanh
    ) {
      setSelectedBranch(nextBranch);
      setSearchTerm("");
      setSearchResults([]);
      setHasLoadedDefault(false);
      fetchWarehouseByBranch(nextBranch.maChiNhanh);
    }
  }, [
    branches,
    activeOrder?.maChiNhanh,
    selectedMaChiNhanh,
    selectedBranch,
    fetchWarehouseByBranch,
  ]);

  const handleChangeBranch = async (branch) => {
    setSelectedBranch(branch);
    setSearchTerm("");
    setSearchResults([]);
    setHasLoadedDefault(false);

    await fetchWarehouseByBranch(branch.maChiNhanh);
    if (onBranchChange) onBranchChange(branch.maChiNhanh);
  };

  // ✅ fetch products: term "" => default list
  const fetchProducts = useCallback(
    async (term) => {
      if (!selectedWarehouseId || warehouseLoading) return;

      const query = term?.trim() || "";

      setLoading(true);
      try {
        let response;

        // ✅ CHƯA SEARCH → lấy hết sản phẩm trong kho
        if (!query) {
          response = await inventoryApi.getInventoryByWarehouse(
            selectedWarehouseId
          );
        }
        // ✅ CÓ SEARCH → tìm theo keyword
        else {
          response = await inventoryApi.searchInventory(
            query,
            selectedWarehouseId,
            20
          );
        }

        setSearchResults(response || []);

        // đánh dấu đã load default list
        if (!query) {
          setHasLoadedDefault(true);
        }
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

    // gõ => search theo keyword
    debouncedFetch(value);
  };

  // ✅ focus => list ra default ngay
  const handleInputFocus = () => {
    setIsFocused(true);

    // nếu chưa load default list thì load luôn
    if (!hasLoadedDefault) {
      fetchProducts("");
    }
  };

  const handleInputBlur = () => setTimeout(() => setIsFocused(false), 200);

  const handleSelectProduct = (inventoryItem) => {
    const soLuongTon = inventoryItem.soLuongTon || 0;
    if (soLuongTon <= 0) {
      alert(
        "Sản phẩm này hiện đã hết hàng (Tồn: 0) và không thể thêm vào đơn."
      );
      return;
    }

    const productToAdd = {
      maSp: inventoryItem.sanPham.maSp,
      tenSp: inventoryItem.sanPham.tenSp,
      maSku: inventoryItem.sanPham.maSku,
      donGia: inventoryItem.sanPham.donGia,
      soLuongTon,
      quantity: 1,
    };

    onAddItemToCart(productToAdd);

    // sau khi chọn: clear search nhưng vẫn giữ default list cho lần focus sau
    setSearchTerm("");
    setIsFocused(false);
  };

  const searchDisabled = selectedWarehouseId === null || warehouseLoading;

  return (
    <Navbar
      variant="dark"
      className="p-0"
      style={{ backgroundColor: "#1e63a3", borderBottom: "2px solid #0d4a7c" }}
    >
      <Container fluid className="px-0">
        <div className="d-flex align-items-stretch w-100">
          {/* SEARCH */}
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
                      : "Bấm để xem danh sách sản phẩm / gõ để tìm"
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

            {/* dropdown search */}
            {isFocused && !searchDisabled && (
              <div
                className="list-group position-absolute w-100 shadow-lg border"
                style={{
                  top: "100%",
                  left: 0,
                  zIndex: 999999999,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {loading || warehouseLoading ? (
                  <div className="list-group-item text-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang tải{warehouseLoading ? " kho hàng..." : " sản phẩm..."}
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="list-group-item text-center text-muted">
                    {searchTerm.trim()
                      ? "Không tìm thấy sản phẩm phù hợp."
                      : hasLoadedDefault
                      ? "Không có sản phẩm."
                      : "Bấm vào ô tìm kiếm để tải danh sách sản phẩm..."}
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
          </div>

          {/* RIGHT */}
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
                <Printer size={16} className="me-1" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">In Hóa đơn</Dropdown.Item>
                <Dropdown.Item href="#/action-2">In Tạm tính</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Orders dropdown */}
            <div
              className="d-flex align-items-center ms-3 me-2"
              style={{ gap: 10 }}
            >
              <div
                className="d-flex align-items-center"
                style={{
                  gap: 8,
                  padding: "6px 8px",
                  background: "#0b4f88",
                  borderRadius: 10,
                }}
              >
                {orders.map((o) => {
                  const isActive = o.id === activeOrderId;

                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => onSwitchOrder?.(o.id)}
                      className="d-flex align-items-center"
                      style={{
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        padding: "8px 12px",
                        borderRadius: 10,
                        fontWeight: 700,
                        background: isActive ? "#ffffff" : "#0a3d6b",
                        color: isActive ? "#0a3d6b" : "#ffffff",
                        gap: 10,
                      }}
                      title={
                        o.cartItems?.length
                          ? `${o.cartItems.length} SP`
                          : "Trống"
                      }
                    >
                      <span>{o.name}</span>

                      {/* nút X: chỉ hiện khi có >=2 đơn */}
                      {orders.length > 1 && orders[0].id !== o.id && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloseOrder?.(o.id);
                          }}
                          style={{
                            width: 20,
                            height: 20,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 999,
                            background: isActive
                              ? "#e9eef5"
                              : "rgba(255,255,255,0.18)",
                            color: isActive ? "#0a3d6b" : "#fff",
                            fontSize: 14,
                            lineHeight: 1,
                            fontWeight: 900,
                          }}
                          title="Đóng đơn"
                        >
                          ×
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* nút + tạo đơn mới */}
              <Button
                variant="light"
                size="sm"
                className="border-0 text-primary"
                onClick={onNewOrder}
                title="Tạo đơn mới"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                }}
              >
                <Plus size={18} />
              </Button>
            </div>

            {/* branch */}
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
                      <GeoAlt size={12} className="me-1" />
                      <div
                        className="fw-bold text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        {warehouseLoading
                          ? "Đang tải kho..."
                          : selectedBranch
                          ? selectedBranch.tenChiNhanh
                          : "Đang tải."}
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
                          selectedBranch?.maChiNhanh === branch.maChiNhanh
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
              />
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

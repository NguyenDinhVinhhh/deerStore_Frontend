import React, { useState, useMemo, useCallback } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import PosNavbar from "../components/Pos/PosNavbar";
import OrderDetailsCol from "../components/Pos/OrderDetailsCol";
import PaymentCol from "../components/Pos/PaymentCol";

const PosScreen = () => {
  // 1. Quản lý trạng thái đơn hàng (Cart State)
  const [cartItems, setCartItems] = useState([]);
  const [customerDiscountAmount, setCustomerDiscountAmount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 🔥 STATE MỚI: Lưu mã chi nhánh được chọn (Nhận từ PosNavbar)
  const [selectedMaChiNhanh, setSelectedMaChiNhanh] = useState(null);

  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // --- HÀM CALLBACK VÀ LOGIC RESET ---

  // 🔥 HÀM MỚI (Thay thế handleClearCartOnBranchChange): Cập nhật mã chi nhánh và Reset giỏ hàng
  const handleBranchChange = useCallback((newMaChiNhanh) => {
    // 1. Cập nhật mã chi nhánh
    setSelectedMaChiNhanh(newMaChiNhanh);

    // 2. Reset giỏ hàng và các trạng thái liên quan
    setCartItems([]);
    setCustomerDiscountAmount(0);
    setSelectedCustomer(null);

    console.log(
      `Chi nhánh đã thay đổi. Mã CN: ${newMaChiNhanh}. Giỏ hàng đã reset.`
    );
  }, []);

  // Hàm callback từ PaymentCol khi khách hàng được chọn/bỏ chọn
  const handleSelectCustomer = useCallback((customer) => {
    setSelectedCustomer(customer);
    if (!customer) {
      setCustomerDiscountAmount(0);
    }
  }, []);

  // Hàm callback từ PaymentCol để cập nhật chiết khấu hạng
  const handleCustomerDiscountChange = useCallback((newDiscount) => {
    setCustomerDiscountAmount(Math.max(0, newDiscount));
  }, []);

  // Thêm/Tăng số lượng sản phẩm (Giữ nguyên)
  const handleAddItemToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.maSp === product.maSp
      );

      if (existingItemIndex > -1) {
        const currentItem = prevItems[existingItemIndex];
        const newQuantity = currentItem.quantity + 1;

        if (newQuantity > currentItem.soLuongTon) {
          alert(
            `Không thể tăng số lượng sản phẩm "${currentItem.tenSp}". Tồn kho tối đa là ${currentItem.soLuongTon}.`
          );
          return prevItems;
        }

        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  // Cập nhật số lượng sản phẩm (Giữ nguyên)
  const handleUpdateQuantity = useCallback((maSp, newQuantity) => {
    const quantity = Math.max(1, newQuantity);

    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.maSp === maSp) {
          if (quantity > item.soLuongTon) {
            alert(
              `Số lượng ${quantity} vượt quá tồn kho hiện tại (${item.soLuongTon}) của sản phẩm "${item.tenSp}".`
            );
            return item;
          }
          return { ...item, quantity: quantity };
        }
        return item;
      });
    });
  }, []);

  // Xóa sản phẩm khỏi giỏ hàng (Giữ nguyên)
  const handleRemoveItem = useCallback((maSp) => {
    setCartItems((prevItems) => {
      return prevItems.filter((item) => item.maSp !== maSp);
    });
  }, []);

  // --- LOGIC TÍNH TOÁN (CART SUMMARY) ---

  const cartSummary = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const rawTotalAmount = cartItems.reduce(
      (sum, item) => sum + item.donGia * item.quantity,
      0
    );

    const discountKhuyenMai = 0; // Giả sử discount này tính ở nơi khác

    // Tổng chiết khấu = Chiết khấu hạng + Chiết khấu Khuyến mãi
    const totalDiscount = customerDiscountAmount + discountKhuyenMai;

    // Tính toán netPayable cuối cùng
    const netPayable = Math.max(0, rawTotalAmount - totalDiscount);

    return {
      totalItems: totalItems,
      totalAmount: rawTotalAmount,
      discount: discountKhuyenMai,
      customerDiscountAmount: customerDiscountAmount,
      netPayable: netPayable,
      customerPaid: 0,
      change: 0,
    };
  }, [cartItems, customerDiscountAmount]);

  // Hàm xử lý tìm kiếm (Giữ nguyên)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Thực hiện tìm kiếm khi nhấn Enter (Đã chuyển logic chính sang PosNavbar)"
    );
  };

  return (
    <div
      className="pos-app-container"
      style={{ minHeight: "100vh", backgroundColor: "#f4f6f9" }}
    >
      <PosNavbar
        onSearchSubmit={handleSearchSubmit}
        onAddItemToCart={handleAddItemToCart}
        onNewOrder={() => console.log("Tạo đơn mới")}
        // 🔥 TRUYỀN HÀM MỚI BAO GỒM LOGIC CẬP NHẬT MA CHI NHÁNH
        onBranchChange={handleBranchChange}
      />

      {/* --- Nội dung chính: 2 cột --- */}
      <Container fluid className="mt-2">
        <Row>
          {/* Cột trái: Chi tiết đơn hàng */}
          <OrderDetailsCol
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />

          {/* Cột phải: Thanh toán */}
          <PaymentCol
            cartSummary={cartSummary}
            onSelectCustomer={handleSelectCustomer}
            onCustomerDiscountChange={handleCustomerDiscountChange}
            // 🔥 TRUYỀN MÃ CHI NHÁNH ĐÃ LẤY TỪ POSNAVBAR XUỐNG
            maChiNhanh={selectedMaChiNhanh}
          />
        </Row>
      </Container>
      <Outlet />
    </div>
  );
};

export default PosScreen;

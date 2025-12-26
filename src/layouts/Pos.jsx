// Pos.jsx
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import PosNavbar from "../components/Pos/PosNavbar";
import OrderDetailsCol from "../components/Pos/OrderDetailsCol";
import PaymentCol from "../components/Pos/PaymentCol";

const STORAGE_KEY = "pos_orders_v1";

const createEmptyOrder = (index, maChiNhanh = null) => ({
  id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
  name: `Đơn ${index}`,
  maChiNhanh,
  cartItems: [],
  // state thuộc về đơn (để switch qua lại vẫn giữ)
  selectedCustomer: null,
  customerDiscountAmount: 0,
  paymentMethodKey: "CASH",
  orderNote: "",
  itemsVoucherDiscount: [],
  createdAt: Date.now(),
});

const loadOrdersFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.orders?.length) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveOrdersToStorage = (payload) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
};

const PosScreen = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  const initial = useMemo(() => {
    const cached = loadOrdersFromStorage();
    if (cached) return cached;

    const first = createEmptyOrder(1, null);
    return {
      orders: [first],
      activeOrderId: first.id,
      selectedMaChiNhanh: null,
    };
  }, []);

  const [orders, setOrders] = useState(initial.orders);
  const [activeOrderId, setActiveOrderId] = useState(initial.activeOrderId);
  const [selectedMaChiNhanh, setSelectedMaChiNhanh] = useState(
    initial.selectedMaChiNhanh
  );

  // đảm bảo activeOrderId luôn tồn tại
  useEffect(() => {
    if (!orders?.length) return;
    const exists = orders.some((o) => o.id === activeOrderId);
    if (!exists) setActiveOrderId(orders[0].id);
  }, [orders, activeOrderId]);

  const activeOrder = useMemo(() => {
    return orders.find((o) => o.id === activeOrderId) || orders[0];
  }, [orders, activeOrderId]);

  // Persist
  useEffect(() => {
    saveOrdersToStorage({ orders, activeOrderId, selectedMaChiNhanh });
  }, [orders, activeOrderId, selectedMaChiNhanh]);

  // Helpers update active order
  const updateActiveOrder = useCallback(
    (patch) => {
      setOrders((prev) => {
        let changed = false;

        const next = prev.map((o) => {
          if (o.id !== activeOrderId) return o;

          // ✅ check từng field trong patch: nếu y hệt thì không update
          for (const k of Object.keys(patch)) {
            if (o[k] !== patch[k]) {
              changed = true;
              break;
            }
          }

          if (!changed) return o;
          return { ...o, ...patch };
        });

        // ✅ nếu không có gì đổi, return prev để React không render lại
        return changed ? next : prev;
      });
    },
    [activeOrderId]
  );

  // Branch change: update global maChiNhanh + reset active order (giữ behavior bạn đang muốn)
  const handleBranchChange = useCallback(
    (newMaChiNhanh) => {
      setSelectedMaChiNhanh(newMaChiNhanh);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === activeOrderId
            ? {
                ...o,
                maChiNhanh: newMaChiNhanh,
                cartItems: [],
                selectedCustomer: null,
                customerDiscountAmount: 0,
                paymentMethodKey: "CASH",
                orderNote: "",
                itemsVoucherDiscount: [],
              }
            : o
        )
      );
    },
    [activeOrderId]
  );

  // ✅ Tạo đơn mới + chuyển sang đơn mới (FIX: tạo 1 lần, add 1 lần)
  const handleNewOrder = useCallback(() => {
    setOrders((prev) => {
      const nextIndex = prev.length + 1;
      const newOrder = createEmptyOrder(nextIndex, selectedMaChiNhanh);

      // chuyển active qua đơn mới ngay tại đây (không tạo thêm lần 2)
      setActiveOrderId(newOrder.id);

      return [...prev, newOrder];
    });
  }, [selectedMaChiNhanh]);

  const handleSwitchOrder = useCallback((orderId) => {
    setActiveOrderId(orderId);
  }, []);

  // --- Cart operations ---
  const handleAddItemToCart = useCallback(
    (product) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== activeOrderId) return o;

          const prevItems = o.cartItems || [];
          const existingItemIndex = prevItems.findIndex(
            (it) => it.maSp === product.maSp
          );

          if (existingItemIndex > -1) {
            const currentItem = prevItems[existingItemIndex];
            const newQuantity = currentItem.quantity + 1;

            if (newQuantity > currentItem.soLuongTon) {
              alert(
                `Không thể tăng số lượng sản phẩm "${currentItem.tenSp}". Tồn kho tối đa là ${currentItem.soLuongTon}.`
              );
              return o;
            }

            const nextItems = prevItems.map((it, idx) =>
              idx === existingItemIndex ? { ...it, quantity: newQuantity } : it
            );
            return { ...o, cartItems: nextItems };
          }

          return {
            ...o,
            cartItems: [...prevItems, { ...product, quantity: 1 }],
          };
        })
      );
    },
    [activeOrderId]
  );

  const handleUpdateQuantity = useCallback(
    (maSp, newQuantity) => {
      const quantity = Math.max(1, newQuantity);

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== activeOrderId) return o;

          const nextItems = (o.cartItems || []).map((item) => {
            if (item.maSp !== maSp) return item;

            if (quantity > item.soLuongTon) {
              alert(
                `Số lượng ${quantity} vượt quá tồn kho hiện tại (${item.soLuongTon}) của sản phẩm "${item.tenSp}".`
              );
              return item;
            }
            return { ...item, quantity };
          });

          return { ...o, cartItems: nextItems };
        })
      );
    },
    [activeOrderId]
  );

  const handleRemoveItem = useCallback(
    (maSp) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === activeOrderId
            ? {
                ...o,
                cartItems: (o.cartItems || []).filter((it) => it.maSp !== maSp),
              }
            : o
        )
      );
    },
    [activeOrderId]
  );

  // --- Customer + discount ---
  const handleSelectCustomer = useCallback(
    (customer) => {
      updateActiveOrder({ selectedCustomer: customer });
    },
    [updateActiveOrder]
  );

  const handleCustomerDiscountChange = useCallback(
    (newDiscount) => {
      updateActiveOrder({ customerDiscountAmount: Math.max(0, newDiscount) });
    },
    [updateActiveOrder]
  );

  // --- Cart summary ---
  const cartSummary = useMemo(() => {
    const cartItems = activeOrder?.cartItems || [];
    const customerDiscountAmount = activeOrder?.customerDiscountAmount || 0;

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const rawTotalAmount = cartItems.reduce(
      (sum, item) => sum + item.donGia * item.quantity,
      0
    );

    const discountKhuyenMai = 0;
    const totalDiscount = customerDiscountAmount + discountKhuyenMai;
    const netPayable = Math.max(0, rawTotalAmount - totalDiscount);

    return {
      totalItems,
      totalAmount: rawTotalAmount,
      discount: discountKhuyenMai,
      customerDiscountAmount,
      netPayable,
    };
  }, [activeOrder]);

  // ✅ Reset active order after pay success
  const handleResetActiveOrder = useCallback(() => {
    updateActiveOrder({
      cartItems: [],
      selectedCustomer: null,
      customerDiscountAmount: 0,
      paymentMethodKey: "CASH",
      orderNote: "",
      itemsVoucherDiscount: [],
    });
  }, [updateActiveOrder]);

  const handleCloseOrder = useCallback(
    (orderId) => {
      console.log(orderId);

      setOrders((prev) => {
        if (prev.length <= 1) return prev; // luôn giữ ít nhất 1 đơn

        const idx = prev.findIndex((o) => o.id === orderId);
        const next = prev.filter((o) => o.id !== orderId);

        // nếu đang đóng đúng đơn active => chuyển sang đơn kế bên
        if (orderId === activeOrderId) {
          const fallback = next[Math.max(0, idx - 1)] || next[0];
          setActiveOrderId(fallback.id);
        }
        return next;
      });
    },
    [activeOrderId]
  );

  return (
    <div
      className="pos-app-container"
      style={{ minHeight: "100vh", backgroundColor: "#f4f6f9" }}
    >
      <PosNavbar
        onAddItemToCart={handleAddItemToCart}
        onNewOrder={handleNewOrder}
        onBranchChange={handleBranchChange}
        orders={orders}
        activeOrderId={activeOrderId}
        onSwitchOrder={handleSwitchOrder}
        selectedMaChiNhanh={selectedMaChiNhanh}
        onCloseOrder={handleCloseOrder}
      />

      <Container fluid className="mt-2">
        <Row>
          <OrderDetailsCol
            cartItems={activeOrder?.cartItems || []}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />

          <PaymentCol
            key={activeOrderId} // remount UI theo đơn
            cartSummary={cartSummary}
            cartItems={activeOrder?.cartItems || []}
            maChiNhanh={activeOrder?.maChiNhanh ?? selectedMaChiNhanh}
            // hydrate + persist state theo đơn
            orderId={activeOrderId}
            initialPaymentState={{
              paymentMethodKey: activeOrder?.paymentMethodKey,
              orderNote: activeOrder?.orderNote,
              itemsVoucherDiscount: activeOrder?.itemsVoucherDiscount,
              selectedCustomer: activeOrder?.selectedCustomer,
            }}
            onSelectCustomer={handleSelectCustomer}
            onCustomerDiscountChange={handleCustomerDiscountChange}
            onPaymentStateChange={(patch) => updateActiveOrder(patch)}
            onCheckoutSuccess={handleResetActiveOrder}
          />
        </Row>
      </Container>

      <Outlet />
    </div>
  );
};

export default PosScreen;

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Nav,
} from "react-bootstrap";
import inventoryApi from "../../../services/inventoryApi";
import warehouseApi from "../../../services/warehouseApi";
export default function Inventory() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // LẤY DANH SÁCH KHO
  // ============================================================
  const fetchWarehouses = async () => {
    try {
      const res = await warehouseApi.getAll();
      setWarehouses(res.data);

      // Auto chọn kho đầu tiên
      if (res.data.length > 0) {
        setSelectedWarehouse(res.data[0].maKho);
        fetchInventory(res.data[0].maKho);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách kho:", err);
    }
  };

  // ============================================================
  // LẤY TỒN KHO CỦA 1 KHO
  // ============================================================
  const fetchInventory = async (maKho) => {
    try {
      setLoading(true);
      const res = await inventoryApi.getInventoryByWarehouse(maKho);
      setInventoryList(res.data);
    } catch (err) {
      console.error("Lỗi lấy tồn kho:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <Container fluid className="p-3">
      <h3 className="mb-3">Nhập hàng & Tồn kho</h3>

      {/* ============================================================
          TABS KHO HÀNG
      ============================================================ */}
      <Nav variant="tabs" activeKey={selectedWarehouse}>
        {warehouses.map((kho) => (
          <Nav.Item key={kho.maKho}>
            <Nav.Link
              eventKey={kho.maKho}
              onClick={() => {
                setSelectedWarehouse(kho.maKho);
                fetchInventory(kho.maKho);
              }}
            >
              {kho.tenKho}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* ============================================================
          DANH SÁCH TỒN KHO
      ============================================================ */}
      <div className="bg-white p-3 mt-3 rounded shadow-sm">
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Ảnh</th>
                <th>Tên SP</th>
                <th>SKU</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Giá vốn</th>
                <th>Số lượng tồn</th>
                <th>Ngày cập nhật</th>
                <th>Ghi chú</th>
              </tr>
            </thead>

            <tbody>
              {inventoryList.map((item) => (
                <tr key={`${item.id.maSp}-${item.id.maKho}`}>
                  <td>
                    <img
                      src={item.sanPham.hinhAnhUrl}
                      alt=""
                      width="55"
                      height="55"
                      style={{ borderRadius: 6, objectFit: "cover" }}
                    />
                  </td>

                  <td className="fw-bold text-primary">{item.sanPham.tenSp}</td>

                  <td>{item.sanPham.maSku}</td>

                  <td>{item.sanPham.danhMuc.tenDanhMuc}</td>

                  <td>{item.sanPham.donGia.toLocaleString()} đ</td>

                  <td>{item.sanPham.giaVon.toLocaleString()} đ</td>

                  <td className="fw-bold text-danger">{item.soLuongTon}</td>

                  <td>{new Date(item.ngayCapNhat).toLocaleString()}</td>

                  <td>{item.ghiChu}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
}

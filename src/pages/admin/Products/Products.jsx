import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { FiPlus, FiUpload, FiDownload } from "react-icons/fi";

import sanPhamApi from "../../../services/productApi";
import { useProduct, useProductBySku } from "../../../hooks/use-product";
import { useCategory } from "../../../hooks/use-category";
export default function Products() {
  const { data: products = [], isLoading: loading, refetch } = useProduct();
  const { data: categories = [] } = useCategory();

  // State modal + form
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchSku, setSearchSku] = useState("");
  const [activeSku, setActiveSku] = useState(""); // SKU đang tìm
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    tenSp: "",
    maSku: "",
    donGia: "",
    giaVon: "",
    moTa: "",
    maDanhMuc: "",
  });

  // Khi products thay đổi → set filteredProducts
  useEffect(() => {
    if (!activeSku) {
      setFilteredProducts(products);
    }
  }, [products, activeSku]);

  // ============================================================
  // LIVE SEARCH BY SKU dùng hook React Query
  // ============================================================
  const { data: foundProduct, isLoading: loadingSku } =
    useProductBySku(activeSku);

  // khi searchSku thay đổi → update activeSku để query
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setActiveSku(searchSku.trim());
    }, 300); // debounce 300ms để không gọi API quá nhiều

    return () => clearTimeout(delayDebounce);
  }, [searchSku]);

  // Bảng hiển thị: nếu đang tìm SKU → show product tìm được
  const displayProducts = activeSku
    ? foundProduct
      ? [foundProduct]
      : []
    : filteredProducts;

  // ============================================================
  // ADD PRODUCT
  // ============================================================
  const handleAddProduct = async () => {
    const donGiaNumber = parseFloat(newProduct.donGia);
    const giaVonNumber = parseFloat(newProduct.giaVon);
    const maDanhMucNumber = parseInt(newProduct.maDanhMuc);

    if (
      !newProduct.tenSp ||
      !newProduct.maSku ||
      isNaN(donGiaNumber) ||
      isNaN(giaVonNumber) ||
      isNaN(maDanhMucNumber)
    ) {
      alert("Vui lòng nhập đầy đủ dữ liệu!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("tenSP", newProduct.tenSp);
      formData.append("maSku", newProduct.maSku);
      formData.append("donGia", donGiaNumber);
      formData.append("giaVon", giaVonNumber);
      formData.append("moTa", newProduct.moTa);
      formData.append("maDanhMuc", maDanhMucNumber);

      if (selectedImage) formData.append("hinhAnhFile", selectedImage);

      await sanPhamApi.create(formData);

      setShowAddModal(false);
      await refetch(); // refresh danh sách

      // reset form
      setNewProduct({
        tenSp: "",
        maSku: "",
        donGia: "",
        giaVon: "",
        moTa: "",
        maDanhMuc: "",
      });
      setSelectedImage(null);
    } catch (err) {
      alert(err.response?.data || "Lỗi thêm sản phẩm");
    }
  };

  return (
    <Container fluid className="p-3" style={{ background: "#fafafa" }}>
      {/* HEADER */}
      <Row className="align-items-center mb-4">
        <Col>
          <InputGroup style={{ maxWidth: 350 }}>
            <Form.Control
              placeholder="Nhập mã SKU để tìm..."
              value={searchSku}
              onChange={(e) => setSearchSku(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col className="text-end">
          <Button variant="outline-success" className="me-2">
            <FiUpload className="me-2" />
            Xuất file
          </Button>

          <Button variant="outline-secondary" className="me-2">
            <FiDownload className="me-2" />
            Nhập file
          </Button>

          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <FiPlus className="me-2" />
            Thêm sản phẩm
          </Button>
        </Col>
      </Row>

      {/* TABLE */}
      <div className="bg-white p-3 rounded shadow-sm">
        {loading || loadingSku ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table hover bordered responsive>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>SKU</th>
                <th>Danh mục</th>
                <th>Đơn giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {displayProducts.map((sp) =>
                sp ? (
                  <tr key={sp.maSp}>
                    <td>
                      <img
                        src={sp.hinhAnhUrl || "/default-image.png"}
                        width="55"
                        height="55"
                        style={{ objectFit: "cover", borderRadius: 6 }}
                        alt={sp.tenSp || "Sản phẩm"}
                      />
                    </td>
                    <td className="text-primary">{sp.tenSp}</td>
                    <td>{sp.maSku}</td>
                    <td>{sp.tenDanhMuc}</td>
                    <td>{sp.donGia.toLocaleString()} đ</td>
                    <td className="fw-bold text-danger">{sp.tonKhoTong}</td>
                    <td>{sp.trangThai ? "Hoạt động" : "Ẩn"}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </Table>
        )}
      </div>

      {/* MODAL THÊM */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                value={newProduct.tenSp}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, tenSp: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mã SKU</Form.Label>
              <Form.Control
                value={newProduct.maSku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, maSku: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Đơn giá</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.donGia}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, donGia: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giá vốn</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.giaVon}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, giaVon: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select
                value={newProduct.maDanhMuc}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, maDanhMuc: e.target.value })
                }
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((dm) => (
                  <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                    {dm.tenDanhMuc}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProduct.moTa}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, moTa: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Ảnh sản phẩm</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Thêm sản phẩm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

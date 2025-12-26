import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Spinner,
  Row,
  Col,
  Card,
  InputGroup,
  Image,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useProduct } from "../../../hooks/use-product";
import { useCategory } from "../../../hooks/use-category";
import sanPhamApi from "../../../services/productApi";
import { formatVND } from "../../../utils/formatUtils";
import {
  FaChevronLeft,
  FaSearch,
  FaTimes,
  FaCamera,
  FaInbox,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function ProductList() {
  const [view, setView] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: products = [],
    isLoading,
    isFetching,
    refetch,
  } = useProduct(debouncedSearch);
  const { data: categories = [] } = useCategory();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Theo dõi file ảnh và tạo URL xem trước
  const imageFile = watch("hinhAnhFile");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // Giải phóng bộ nhớ khi file thay đổi hoặc component unmount
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const handleEdit = (product = null) => {
    setSelectedProduct(product);
    setPreviewImage(product?.hinhAnhUrl || null);
    if (product) {
      reset({
        tenSp: product.tenSp, // Form nội bộ dùng tenSp
        maSku: product.maSku,
        donGia: product.donGia,
        giaVon: product.giaVon,
        moTa: product.moTa || "",
        maDanhMuc: product.maDanhMuc,
      });
    } else {
      reset({
        tenSp: "",
        maSku: "",
        donGia: 0,
        giaVon: 0,
        moTa: "",
        maDanhMuc: "",
      });
    }
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedProduct(null);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Chuyển tất cả về String để khớp với cách nhận @RequestParam("...") String của bạn
      formData.append("tenSP", data.tenSp);
      formData.append("maSku", data.maSku);
      formData.append("donGia", data.donGia.toString());
      formData.append("giaVon", data.giaVon.toString());
      formData.append("moTa", data.moTa || "");
      formData.append("maDanhMuc", data.maDanhMuc.toString());

      if (data.hinhAnhFile && data.hinhAnhFile[0]) {
        // Key phải khớp chính xác với @RequestPart hoặc @RequestParam("hinhAnhFile")
        formData.append("hinhAnhFile", data.hinhAnhFile[0]);
      }

      if (selectedProduct) {
        await sanPhamApi.update(selectedProduct.maSp, formData);
        Swal.fire("Thành công", "Cập nhật sản phẩm hoàn tất", "success");
      } else {
        await sanPhamApi.create(formData);
        Swal.fire("Thành công", "Đã thêm sản phẩm mới", "success");
      }
      refetch();
      handleBack();
    } catch (error) {
      if (error.response?.status === 403) {
        Swal.fire(
          "Lỗi 403",
          "Bạn không có quyền 'THEM_SAN_PHAM' hoặc Token hết hạn.",
          "error"
        );
      } else {
        // Hiển thị nội dung lỗi từ các đoạn catch (badRequest) ở Backend của bạn
        const serverMessage = error.response?.data;
        Swal.fire(
          "Lỗi",
          typeof serverMessage === "string"
            ? serverMessage
            : "Thao tác thất bại",
          "error"
        );
      }
    }
  };
  if (view === "list") {
    return (
      <div className="p-4 bg-light min-vh-100">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <InputGroup style={{ maxWidth: "400px" }} className="shadow-sm">
            <InputGroup.Text className="bg-white border-end-0 text-muted">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm tên hoặc mã SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0 ps-0 shadow-none"
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                className="border-start-0 bg-white"
                onClick={() => setSearchTerm("")}
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
          <Button
            variant="primary"
            onClick={() => handleEdit()}
            className="px-4 fw-bold shadow-sm"
          >
            + Thêm sản phẩm
          </Button>
        </div>

        {isLoading || isFetching ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted small">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Card className="border-0 shadow-sm overflow-hidden">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Sản phẩm</th>
                  <th>Mã SKU</th>
                  <th>Danh mục</th>
                  <th className="text-end">Giá bán</th>
                  <th className="text-center pe-4">Tồn kho</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((p) => (
                    <tr
                      key={p.maSp}
                      onClick={() => handleEdit(p)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="ps-4 d-flex align-items-center">
                        <Image
                          src={p.hinhAnhUrl}
                          width={40}
                          height={40}
                          className="me-3 rounded object-fit-cover border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                        <div className="fw-bold text-dark">{p.tenSp}</div>
                      </td>
                      <td>{p.maSku}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary">
                          {p.tenDanhMuc}
                        </span>
                      </td>
                      <td className="text-end fw-bold">
                        {formatVND(p.donGia)}
                      </td>
                      <td className="text-center pe-4 font-monospace">
                        {p.tonKhoTong}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <FaInbox size={40} className="mb-3 opacity-25" />
                      <p className="mb-0 fw-medium">
                        Không tìm thấy sản phẩm nào
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom shadow-sm">
        <div
          onClick={handleBack}
          style={{ cursor: "pointer" }}
          className="d-flex align-items-center text-secondary"
        >
          <FaChevronLeft className="me-2" /> Quay lại danh sách sản phẩm
        </div>
        <Button
          variant="primary"
          className="px-4 fw-bold"
          onClick={handleSubmit(onSubmit)}
        >
          Lưu sản phẩm
        </Button>
      </div>

      <Form className="p-4">
        <Row>
          <Col md={7}>
            <Card className="border-0 shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-4">Thông tin chung</h5>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">
                  Tên sản phẩm <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...register("tenSp", { required: true })}
                  isInvalid={!!errors.tenSp}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      Mã SKU <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      {...register("maSku", { required: true })}
                      isInvalid={!!errors.maSku}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      Danh mục <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      {...register("maDanhMuc", { required: true })}
                      isInvalid={!!errors.maDanhMuc}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                          {cat.tenDanhMuc}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Mô tả</Form.Label>
                <Form.Control as="textarea" rows={5} {...register("moTa")} />
              </Form.Group>
            </Card>
          </Col>

          <Col md={5}>
            <Card className="border-0 shadow-sm p-4 mb-4 text-center">
              <h5 className="fw-bold mb-4 text-start">Hình ảnh sản phẩm</h5>
              <div
                className="border rounded d-flex flex-column align-items-center justify-content-center bg-light mb-3"
                style={{
                  height: "250px",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {previewImage ? (
                  <Image
                    src={previewImage}
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <div className="text-muted">
                    <FaCamera size={40} className="mb-2" />
                    <p className="small mb-0">Nhấn để tải ảnh lên</p>
                  </div>
                )}
              </div>
              <Form.Control
                id="fileInput"
                type="file"
                accept="image/*"
                className="d-none"
                {...register("hinhAnhFile")}
              />
            </Card>

            <Card className="border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-4">Giá bán</h5>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Giá bán lẻ (VND)</Form.Label>
                <Form.Control
                  type="number"
                  {...register("donGia")}
                  className="fw-bold text-primary fs-5"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="text-muted">Giá vốn (VND)</Form.Label>
                <Form.Control
                  type="number"
                  {...register("giaVon")}
                  className="fw-bold text-danger fs-5"
                />
              </Form.Group>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

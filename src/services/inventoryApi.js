import axios from "./axiosClient"; 

const BASE_URL = "/ton-kho";

const inventoryApi = {
    // 4. Lấy danh sách tồn kho của toàn bộ sản phẩm trong 1 kho
  getInventoryByWarehouse(maKho) {
    return axios.get(`${BASE_URL}/warehouses/${maKho}`);
  },

  // 1. Lấy danh sách sản phẩm kèm trạng thái tồn kho (Dùng ID Kho để lọc)
  // GET /api/ton-kho?maKho=101
  getInventoryWithStatus: (maKho) => 
    axios.get(`${BASE_URL}`, { params: { maKho } }),

  // 2. Thiết lập tồn kho ban đầu (POST)
  // Payload: { maSp, maKho, soLuongTon, ghiChu }
  setupInitialStock(data) {
    return axios.post(`${BASE_URL}`, data);
  },

  // 3. Lấy kho hàng từ mã chi nhánh (Để lấy maKho từ maChiNhanh)
  // GET /api/kho-hang/chi-nhanh/{maCn}
  getWarehousesByBranch: (maCn) => 
    axios.get(`/kho-hang/chi-nhanh/${maCn}`),

  // 4. Điều chỉnh tồn kho (Dùng cho API Tăng/Giảm sau này)
  adjustInventory(data) {
    return axios.put(`${BASE_URL}/adjust`, data);
  },

  // --- Các hàm báo cáo & chi tiết (Giữ nguyên logic của bạn) ---

  getTotalStockByProduct: (maSp) => 
    axios.get(`${BASE_URL}/products/${maSp}/total`),

  getInventoryDetailsByProduct: (maSp) => 
    axios.get(`${BASE_URL}/products/${maSp}/details`),

  getTopLowStockProducts: (limit = 10) => 
    axios.get(`${BASE_URL}/report/low-stock?limit=${limit}`),

  getTopLowStockProductsByBranch: (maCn, limit = 10) => 
    axios.get(`${BASE_URL}/report/branches/${maCn}/low-stock?limit=${limit}`),
};

export default inventoryApi;
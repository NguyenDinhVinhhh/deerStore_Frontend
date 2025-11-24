
import axios from "./axiosClient"; 

const BASE_URL = "/ton-kho";

const inventoryApi = {
  //thiết lập tồn kho ban đầu
  updateInventory(data) {
    return axios.post(`${BASE_URL}`, data);
  },

  // lấy tổng tồn kho của 1 sản phẩm 
  getTotalStockByProduct(maSp) {
    return axios.get(`${BASE_URL}/products/${maSp}/total`);
  },

  // lấy chi tiết tồn kho của từng sản phẩm 
  getInventoryDetailsByProduct(maSp) {
    return axios.get(`${BASE_URL}/products/${maSp}/details`);
  },

  /// lấy toàn bộ tồn kho trong 1 kho 
  getInventoryByWarehouse(maKho) {
    return axios.get(`${BASE_URL}/warehouses/${maKho}`);
  },

  // điều chỉnh tồn kho nhập hoặc xuất
  adjustInventory(data) {
    return axios.put(`${BASE_URL}/adjust`, data);
  },

  // báo cáo tồn kho theo danh mục 
  getReportByCategory() {
    return axios.get(`${BASE_URL}/report/by-category`);
  },

  // =====================================
  // 7. TOP sản phẩm tồn kho thấp nhất tất cả kho
  // GET /api/ton-kho/report/low-stock?limit=10
  // =====================================
  getTopLowStockProducts(limit = 10) {
    return axios.get(`${BASE_URL}/report/low-stock?limit=${limit}`);
  },

  // =====================================
  // 8. TOP sản phẩm tồn kho thấp nhất theo từng kho
  // GET /api/ton-kho/report/warehouses/{maKho}/low-stock
  // =====================================
  getTopLowStockProductsByWarehouse(maKho, limit = 10) {
    return axios.get(
      `${BASE_URL}/report/warehouses/${maKho}/low-stock?limit=${limit}`
    );
  },

  // =====================================
  // 9. TOP sản phẩm tồn kho thấp nhất theo chi nhánh
  // GET /api/ton-kho/report/branches/{maCn}/low-stock
  // =====================================
  getTopLowStockProductsByBranch(maCn, limit = 10) {
    return axios.get(
      `${BASE_URL}/report/branches/${maCn}/low-stock?limit=${limit}`
    );
  },

  searchInventory(query, maKho, limit = 10) {
    return axios.get(
      `${BASE_URL}/search?query=${query}&maKho=${maKho}&limit=${limit}`
    );
  },
};

export default inventoryApi;

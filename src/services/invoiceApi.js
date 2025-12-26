// services/invoiceApi.js
import axios from "./axiosClient"; // Giả định axiosClient đã được cấu hình

const BASE_URL = "/invoices"; // Endpoint chính là /api/invoices

const invoiceApi = {
  // =====================================
  // 1. Tạo hóa đơn (bao gồm chi tiết items và payment)
  // POST /api/invoices/create
  // @param {object} data - Payload hóa đơn
  // @returns {Promise<object>} Dữ liệu phản hồi (chứa payUrl nếu là thanh toán online)
  // =====================================
  createInvoice(data) {
    // Endpoint hoàn chỉnh: /api/invoices/create
    // Giả sử axiosClient được cấu hình để gửi JSON
    return axios.post(`${BASE_URL}/create`, data);
  },

  // =====================================
  // 2. Lấy chi tiết hóa đơn theo mã
  // GET /api/invoices/{maHd}
  // =====================================
  getInvoiceDetails(maHd) {
    return axios.get(`${BASE_URL}/${maHd}`);
  },

  // =====================================
  // 3. Lấy danh sách hóa đơn theo ngày (ví dụ)
  // GET /api/invoices/search
  // =====================================
  searchInvoices(params) {
    // params có thể là { date: 'YYYY-MM-DD', status: 'PAID' }
    return axios.get(`${BASE_URL}/search`, { params });
  },

  // =====================================
  // 4. Cập nhật trạng thái hóa đơn (ví dụ: đã thanh toán)
  // PUT /api/invoices/{maHd}/status
  // =====================================
  updateInvoiceStatus(maHd, statusData) {
    return axios.put(`${BASE_URL}/${maHd}/status`, statusData);
  },

  // 5. Lấy thông tin tổng quan kinh doanh (Dashboard)
  // GET /api/invoices/dashboard?maChiNhanh={maChiNhanh}
  getDashboardSummary(maChiNhanh) {
    return axios.get(`${BASE_URL}/dashboard`, {
      params: { maChiNhanh }
    });
  },

  // 6. Lấy dữ liệu biểu đồ doanh thu (MỚI CẬP NHẬT)
  // Khớp với @PostMapping("/doanh-thu/bieu-do")
  getRevenueChartData(request) {
    return axios.post(`${BASE_URL}/doanh-thu/bieu-do`, request);
  },

  getBranchComparison(thoiGian) {
    return axios.get(`${BASE_URL}/doanh-thu/so-sanh-chi-nhanh`, {
      params: { thoiGian }
    });
  },
  getAll: (params) => axios.get(`${BASE_URL}`, { params }),
};

export default invoiceApi;
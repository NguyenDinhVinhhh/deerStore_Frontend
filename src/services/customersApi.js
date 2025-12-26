import axiosClient from "./axiosClient";

const API_BASE_URL = "/khach-hang";

const khachHangApi = {
  // Lấy tất cả khách hàng
  getAll: () => axiosClient.get(API_BASE_URL), 

  // Thêm mới khách hàng
  create: (data) => axiosClient.post(API_BASE_URL, data),

  // Cập nhật khách hàng (Bổ sung hàm này)
  update: (id, data) => axiosClient.put(`${API_BASE_URL}/${id}`, data),

  // Tìm kiếm khách hàng (Bỏ .then(getData) vì axiosClient đã xử lý rồi)
  search: (keyword) => {
    return axiosClient.get(`${API_BASE_URL}/tim-kiem`, {
      params: { keyword },
    });
  },

  // Lấy chiết khấu
  getDiscountPercent: (ma_kh) => {
    return axiosClient.get(`${API_BASE_URL}/${ma_kh}/thong-tin-giam-gia`);
  },
};

export default khachHangApi;
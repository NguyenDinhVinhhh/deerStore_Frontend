import axiosClient from "./axiosClient";

const API_BASE_URL = "/khach-hang";

const khachHangApi = {

  
  getAll: () => axiosClient.get("/khach-hang"), 

  create: (data) => axiosClient.post(API_BASE_URL, data).then(khachHangApi.getData), 

  // Tìm kiếm Khách hàng. GET /api/khach-hang/tim-kiem?keyword=...
  search: (keyword) => {
    return axiosClient.get(`${API_BASE_URL}/tim-kiem`, {
      params: { keyword },
    }).then(khachHangApi.getData);
  },

  // Lấy chiết khấu. GET /api/khach-hang/{ma_kh}/thong-tin-giam-gia
  getDiscountPercent: (ma_kh) => {
    return axiosClient.get(`${API_BASE_URL}/${ma_kh}/thong-tin-giam-gia`).then(khachHangApi.getData);
  },
};

export default khachHangApi;
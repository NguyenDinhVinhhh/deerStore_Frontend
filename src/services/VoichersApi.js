// khuyenMaiApi.js
import axiosClient from "./axiosClient";

const khuyenMaiApi = {
  // Lấy tất cả khuyến mãi
  getAll: () => axiosClient.get("/khuyen-mai"),

  // Lấy khuyến mãi theo id
  getById: (id) => axiosClient.get(`/khuyen-mai/${id}`),

  // Thêm mới khuyến mãi
  create: (data) => axiosClient.post("/khuyen-mai", data),

  // Cập nhật khuyến mãi
  update: (id, data) => axiosClient.put(`/khuyen-mai/${id}`, data),

  // Xóa khuyến mãi
  delete: (id) => axiosClient.delete(`/khuyen-mai/${id}`),

  // Kiểm tra code khuyến mãi hợp lệ
  checkCode: (maCode) => axiosClient.get(`/khuyen-mai/kiem-tra-code`, { params: { maCode } }),
};

export default khuyenMaiApi;

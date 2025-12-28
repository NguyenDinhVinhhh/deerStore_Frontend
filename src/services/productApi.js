import axiosClient from "./axiosClient";

const sanPhamApi = {
  getAll: () => axiosClient.get("/san-pham"),
  
  getById: (id) => axiosClient.get(`/san-pham/${id}`),

  search: (keyword) => {
    return axiosClient.get("/san-pham/search", {
      params: { keyword },
    });
  },
  
  create: (formData) => {
    return axiosClient.post("/san-pham", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 1️⃣ Cập nhật thông tin chung (Sử dụng endpoint /{id}/thong-tin)
  updateThongTin: (id, formData) => {
    return axiosClient.put(`/san-pham/${id}/thong-tin`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 2️⃣ Cập nhật giá sản phẩm (Sử dụng endpoint /{id}/gia)
  // params truyền vào: { donGia, giaVon }
  updateGia: (id, params) => {
    return axiosClient.put(`/san-pham/${id}/gia`, null, {
      params: params // Truyền donGia và giaVon dưới dạng @RequestParam
    });
  },

  delete: (id) => axiosClient.delete(`/san-pham/${id}`),
};

export default sanPhamApi;
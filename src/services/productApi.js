import axiosClient from "./axiosClient";

const sanPhamApi = {
  getAll: () => axiosClient.get("/san-pham"),
  
  getById: (id) => axiosClient.get(`/san-pham/${id}`),

  getBySku: (sku) => axiosClient.get(`/san-pham/sku/${sku}`),

  // BỔ SUNG: Khớp với URL Postman http://localhost:8080/api/san-pham/search?keyword=...
  search: (keyword) => {
    return axiosClient.get("/san-pham/search", {
      params: { keyword },
    });
  },
  
  create: (formData) => {
    return axiosClient.post("/san-pham", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: (id, formData) => {
    return axiosClient.put(`/san-pham/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id) => axiosClient.delete(`/san-pham/${id}`),
};

export default sanPhamApi;
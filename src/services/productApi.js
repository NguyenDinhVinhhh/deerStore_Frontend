import axiosClient from "./axiosClient";

const sanPhamApi = {
  getAll: () => axiosClient.get("/san-pham"),
  getById: (id) => axiosClient.get(`/san-pham/${id}`),

 getBySku: (id) => axiosClient.get(`/san-pham/sku/${id}`),
  
  create: (formData) => {
    return axiosClient.post("/san-pham", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // ---- UPDATE NHẬN FORM DATA TRỰC TIẾP ----
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

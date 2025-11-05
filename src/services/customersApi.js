// src/api/khachHangApi.js
import axiosClient from "./axiosClient";

const khachHangApi = {
  getAll: () => axiosClient.get("/khachhang"),
  getById: (id) => axiosClient.get(`/khachhang/${id}`),
  create: (data) => axiosClient.post("/khachhang", data),
  update: (id, data) => axiosClient.put(`/khachhang/${id}`, data),
  delete: (id) => axiosClient.delete(`/khachhang/${id}`)
};

export default khachHangApi;

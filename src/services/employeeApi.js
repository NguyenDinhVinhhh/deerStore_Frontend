
import axiosClient from "./axiosClient";

const employeeApi = {

  getAll: () => axiosClient.get("/nhanvien"),

  getById: (id) => axiosClient.get(`/nhanvien/${id}`),

  create: (data) => axiosClient.post("/nhanvien", data),

  update: (id, data) => axiosClient.put(`/nhanvien/${id}`, data),
  delete: (id) => axiosClient.delete(`/nhanvien/${id}`),

  getPaginated: (page, size) => axiosClient.get(`/nhanvien/page?page=${page}&size=${size}`),

  search: (keyword) => axiosClient.get(`/nhanvien/search?keyword=${keyword}`)
};

export default employeeApi;

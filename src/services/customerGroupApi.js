
import axios from "./axiosClient";

const customerGroupApi = {
  getAll: () => axios.get("/nhomkhachhang"),
  add: (data) => axios.post("/nhomkhachhang", data),
  getById: (id) => axios.get(`/nhomkhachhang/${id}`),
  update: (id, data) => axios.put(`/nhomkhachhang/${id}`, data),
  delete: (id) => axios.delete(`/nhomkhachhang/${id}`),
};

export default customerGroupApi;

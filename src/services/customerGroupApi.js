
import axios from "./axiosClient";

const customerGroupApi = {
  getAll: () => axios.get("/nhom-khach-hang"),
  create: (data) => axios.post("/nhom-khach-hang", data),
  getById: (id) => axios.get(`/nhom-khach-hang/${id}`),
  update: (id, data) => axios.put(`/nhom-khach-hang/${id}`, data),
  delete: (id) => axios.delete(`/nhom-khach-hang/${id}`),
};

export default customerGroupApi;

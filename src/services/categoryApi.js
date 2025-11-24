
import axiosClient from "./axiosClient";

const categoryApi = {
  getAll: () => axiosClient.get("/danh-muc"), 
  getById: (id) => axiosClient.get(`/danh-muc/${id}`), 
  create: (data) => axiosClient.post("/danh-muc", data), 
  update: (id, data) => axiosClient.put(`/danh-muc/${id}`, data),
  delete: (id) => axiosClient.delete(`/danh-muc/${id}`),
};

export default categoryApi;

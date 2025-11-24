import axiosClient from "./axiosClient";

const branchApi = {

  getAll: () => axiosClient.get("/chi-nhanh"),

  getById: (id) => axiosClient.get(`/chi-nhanh/${id}`),

  create: (data) => axiosClient.post("/chi-nhanh", data),
  
  update: (id, data) => axiosClient.put(`/chi-nhanh/${id}`, data),

  delete: (id) => axiosClient.delete(`/chi-nhanh/${id}`),

};

export default branchApi;

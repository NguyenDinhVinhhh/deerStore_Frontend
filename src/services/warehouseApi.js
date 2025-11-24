
import axiosClient from "./axiosClient";

const khohangApi = {
  getAll: () => axiosClient.get("/kho-hang"), 
  getById: (id) => axiosClient.get(`/kho-hang/${id}`), 
  create: (data) => axiosClient.post("/kho-hang", data), 
  update: (id, data) => axiosClient.put(`/kho-hang/${id}`, data),
  delete: (id) => axiosClient.delete(`/kho-hang/${id}`),
  getByMaChiNhanh: (maChiNhanh) => 
    axiosClient.get(`/kho-hang/chi-nhanh/${maChiNhanh}`),

};

export default khohangApi;

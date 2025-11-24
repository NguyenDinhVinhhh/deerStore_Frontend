
import axiosClient from "./axiosClient";

const authApi = {

  login: (data) => axiosClient.post("/auth/login", data),


  registerStaff: (data) => axiosClient.post("/auth/register/staff", data),


  getAll: () => axiosClient.get("/auth/tai-khoan"),

  
  searchByHoTen: (hoTen) =>
    axiosClient.get("/auth/tai-khoan/search", { params: { hoTen } }),

  update: (maTk, data) => axiosClient.put(`/auth/tai-khoan/${maTk}`, data),
};

export default authApi;

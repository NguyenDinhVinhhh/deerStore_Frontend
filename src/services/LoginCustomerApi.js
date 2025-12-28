import axiosClient from "./axiosClient";

const loginApi = {
  // 🔐 Đăng nhập nhân viên (Endpoint cũ của bạn)
  login: (data) => {
    return axiosClient.post("/auth/login", data);
  },

  // 👤 Đăng nhập Khách hàng
  loginCustomer: (data) => {
    return axiosClient.post("/auth/customer/login", data);
  },

  // 📝 Đăng ký Khách hàng
  registerCustomer: (data) => {
    return axiosClient.post("/auth/customer/register", data);
  }
};

export default loginApi;
// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Chèn token cho những API cần xác thực
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Nếu có token và endpoint KHÔNG thuộc nhóm public
    const isPublicEndpoint =
      config.url.includes("/san-pham") || // public
      config.url.includes("/danh-muc") || // public
      config.url.includes("/register") || // public
      config.url.includes("/login"); // public

    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Bắt lỗi chung
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default axiosClient;

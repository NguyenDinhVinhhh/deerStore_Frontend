// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api", // URL backend Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Tự động chèn token nếu có (khi login)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Bắt lỗi chung cho toàn hệ thống
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response);
    throw error;
  }
);

export default axiosClient;

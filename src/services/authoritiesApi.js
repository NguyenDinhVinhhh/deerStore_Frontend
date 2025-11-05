// src/api/quyenApi.js
import axiosClient from "./axiosClient";

const authoritiesApi = {
  getAll: () => axiosClient.get("/quyen"),
};

export default authoritiesApi;
// src/api/vaiTroApi.js
import axiosClient from "./axiosClient";

const roleApi = {
  getAll: () => axiosClient.get("/vaitro"),
  getById: (id) => axiosClient.get(`/vaitro/${id}`),
  getPermissions: (roleId) => axiosClient.get(`/vaitro/${roleId}/quyen`),
  assignPermission: (roleId, permissionId) =>
    axiosClient.post(`/vaitro/${roleId}/quyen/${permissionId}`),
  removePermission: (roleId, permissionId) =>
    axiosClient.delete(`/vaitro/${roleId}/quyen/${permissionId}`)
};

export default roleApi;

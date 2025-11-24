
import axiosClient from "./axiosClient";

const roleApi = {
  getAll: () => axiosClient.get("/vaitro"),
  getPermissions: (roleId) => axiosClient.get(`/vaitro/${roleId}/permissions`),
  assignPermission: (roleId, permissionId) =>
    axiosClient.post(`/vaitro/${roleId}/assign/${permissionId}`),
  removePermission: (roleId, permissionId) =>
    axiosClient.delete(`/vaitro/${roleId}/remove/${permissionId}`),
  create: (data) => axiosClient.post("/vaitro", data), 
};

export default roleApi;

import axiosClient from "./axiosClient";

const historyApi = {
  getHistory: (soDienThoai) => {
    return axiosClient.get("/lich-su-mua-hang", {
      params: { soDienThoai }
    });
  }
};

export default historyApi;
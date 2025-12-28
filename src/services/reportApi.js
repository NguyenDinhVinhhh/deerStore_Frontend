import axiosClient from "./axiosClient";

const reportApi = {
  // API Top sản phẩm bán chạy
  getTopProducts: (params) => {
    // params: { range: 'MONTH', type: 'ORDER', maChiNhanh: 1, limit: 5 }
    return axiosClient.get("/bao-cao/top-san-pham", { params });
  }
};

export default reportApi;
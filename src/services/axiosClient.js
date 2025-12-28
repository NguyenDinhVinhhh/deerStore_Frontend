
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");


    const isPublicEndpoint =
      config.url.includes("/san-pham") || 
      config.url.includes("/danh-muc") || 
      config.url.includes("/chi-nhanh") || 
      config.url.includes("/lich-su-mua-hang") || 
      config.url.includes("/register") || 
      config.url.includes("/login"); 

    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default axiosClient;

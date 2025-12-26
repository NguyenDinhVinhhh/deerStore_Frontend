// src/hooks/useCustomer.js
import { useQuery } from "@tanstack/react-query";
import khachHangApi from "../services/customersApi";

export const useCustomer = (keyword = "") => {
  return useQuery({
    queryKey: ["customers", keyword], // keyword là một phần của queryKey
    queryFn: async () => {
      // Nếu có keyword thì gọi api search, ngược lại gọi getAll
      const res = keyword 
        ? await khachHangApi.search(keyword) 
        : await khachHangApi.getAll();
      return Array.isArray(res) ? res : [];
    },
    staleTime: 30000, // Giảm staleTime để tìm kiếm nhạy hơn
  });
};
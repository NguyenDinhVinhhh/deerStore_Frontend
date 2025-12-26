import { useQuery } from "@tanstack/react-query";
import customerGroupApi from "../services/customerGroupApi";

export const useCustomerGroup = () => {
  return useQuery({
    queryKey: ["customerGroups"], // Khóa duy nhất để định danh dữ liệu này trong bộ nhớ đệm
    queryFn: async () => {
      const data = await customerGroupApi.getAll();
      return Array.isArray(data) ? data : []; // Đảm bảo luôn trả về mảng
    },
    staleTime: 60 * 1000, // Dữ liệu được coi là mới trong 1 phút
  });
};
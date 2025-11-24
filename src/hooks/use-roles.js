import { useQuery } from "@tanstack/react-query";
import roleApi from "../services/roleApi";

// Lấy danh sách tất cả sản phẩm
export const useRole = () => {
  return useQuery({
    queryKey: ["role"],
    queryFn: () => roleApi.getAll(),
    staleTime: 60 * 1000,
  });
};

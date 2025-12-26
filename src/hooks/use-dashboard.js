import { useQuery } from "@tanstack/react-query";
import invoiceApi from "../services/invoiceApi";

export const useDashboardSummary = (maChiNhanh) => {
  return useQuery({
    queryKey: ["dashboard-summary", maChiNhanh],
    queryFn: async () => {
      // Nếu maChiNhanh là "all" hoặc rỗng, truyền null để khớp với API tổng hợp
      const param = (maChiNhanh === "all" || !maChiNhanh) ? null : maChiNhanh;
      const res = await invoiceApi.getDashboardSummary(param);
      return res; 
    },
    staleTime: 30 * 1000,
  });
};
import { useQuery } from "@tanstack/react-query";
import invoiceApi from "../services/invoiceApi";

export const useBranchComparison = (thoiGian) => {
  return useQuery({
    queryKey: ["branch-comparison", thoiGian],
    queryFn: async () => {
      const res = await invoiceApi.getBranchComparison(thoiGian);
      // Ánh xạ dữ liệu trả về (maChiNhanh, tenChiNhanh, doanhThu) sang (label, value) để PieChart dùng chung
      return res.map(item => ({
        label: item.tenChiNhanh,
        value: item.doanhThu
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};
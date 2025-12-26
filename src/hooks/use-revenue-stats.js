// hooks/use-revenue-stats.js
import { useQuery } from "@tanstack/react-query";
import invoiceApi from "../services/invoiceApi";

export const useRevenueStats = (kieuThoiGian, maChiNhanh) => {
  return useQuery({
    queryKey: ["revenue-chart", kieuThoiGian, maChiNhanh],
    queryFn: async () => {
      const request = {
        kieuThoiGian: kieuThoiGian, // Ví dụ: "BAY_NGAY_QUA", "NAM_NAY"
        maChiNhanh: maChiNhanh === "all" ? null : parseInt(maChiNhanh)
      };
      
      const res = await invoiceApi.getRevenueChartData(request);
      
      // Đảm bảo dữ liệu trả về đúng định dạng Recharts cần (label, value)
      return Array.isArray(res) ? res : [];
    },
    staleTime: 5 * 60 * 1000, // Dữ liệu báo cáo có thể để lâu hơn (5 phút)
  });
};
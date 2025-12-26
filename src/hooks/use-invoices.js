import { useQuery } from "@tanstack/react-query";
import invoiceApi from "../services/invoiceApi";

// hooks/use-invoices.js
export const useInvoices = (filters) => {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: async () => {
      // 1. Tạo một object filter sạch
      const cleanParams = {
        page: filters.page || 0,
        size: filters.size || 10
      };
      
      // 2. Chỉ đính kèm maChiNhanh nếu có giá trị thực
      if (filters.maChiNhanh && filters.maChiNhanh !== "all" && filters.maChiNhanh !== "") {
        cleanParams.maChiNhanh = filters.maChiNhanh;
      }

      // 3. Chỉ đính kèm trangThai nếu có giá trị thực
      if (filters.trangThai && filters.trangThai !== "") {
        cleanParams.trangThai = filters.trangThai;
      }

      // 4. Bổ sung lọc theo ngày (start và end) khớp với API Backend
      // Nếu có startDate/endDate từ Component, chúng ta truyền vào 'start' và 'end'
      if (filters.start) {
        cleanParams.start = filters.start;
      }
      if (filters.end) {
        cleanParams.end = filters.end;
      }

      const res = await invoiceApi.getAll(cleanParams);
      return res;
    },
    keepPreviousData: true,
    staleTime: 5000 // Tăng hiệu năng khi chuyển trang
  });
};
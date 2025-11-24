import { useQuery } from "@tanstack/react-query";
import sanPhamApi from "../services/productApi";

// Lấy danh sách tất cả sản phẩm
export const useProduct = () => {
  return useQuery({
    queryKey: ["product"],
    queryFn: () => sanPhamApi.getAll(),
    staleTime: 60 * 1000,
  });
};

// Tìm sản phẩm theo SKU
export const useProductBySku = (sku) => {
  return useQuery({
    queryKey: ["product", "sku", sku],
    queryFn: () => sanPhamApi.getBySku(sku),
    enabled: !!sku,  // chỉ chạy khi sku có giá trị
    staleTime: 30 * 1000,
  });
};

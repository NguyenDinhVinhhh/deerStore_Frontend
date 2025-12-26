import { useQuery } from "@tanstack/react-query";
import sanPhamApi from "../services/productApi";

export const useProduct = (keyword = "") => {
  return useQuery({
    queryKey: ["products", keyword],
    queryFn: async () => {
      const res = keyword ? await sanPhamApi.search(keyword) : await sanPhamApi.getAll();
      return Array.isArray(res) ? res : [];
    },
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

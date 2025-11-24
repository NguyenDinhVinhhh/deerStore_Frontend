import { useQuery } from "@tanstack/react-query";
import inventoryApi from "../services/inventoryApi";


export const useTotalStock = (maSp) => {
  return useQuery({
    queryKey: ["totalStock", maSp], 
    queryFn: () => inventoryApi.getTotalStockByProduct(maSp).then(res => res.data),
    enabled: !!maSp, 
    staleTime: 60 * 1000, 
  });
};

export const useInventoryByWarehouse = (maKho) => {
  return useQuery({
    queryKey: ["inventoryByWarehouse", maKho], 
    queryFn: () => inventoryApi.getInventoryByWarehouse(maKho).then(res => res.data),
    enabled: !!maKho, 
    staleTime: 1000 * 60 * 5, 
  });
};

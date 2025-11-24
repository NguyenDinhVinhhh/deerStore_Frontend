import { useQuery } from "@tanstack/react-query";
import warehouseApi from "../services/warehouseApi";


export const useWarehouse = () => {
  return useQuery({
    queryKey: ["warehouse"],
    queryFn: () => warehouseApi.getAll(),
    staleTime: 60 * 1000,
  });
};
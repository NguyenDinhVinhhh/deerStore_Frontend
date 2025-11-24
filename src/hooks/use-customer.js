
import { useQuery } from "@tanstack/react-query";
import customersApi from "../services/customersApi";

export const useCustomer = () => {
  return useQuery({
    queryKey: ["customer"],
    queryFn: () => customersApi.getAll(),
    staleTime: 60 * 1000,
    initialData: [],
  });
};
import { useQuery } from "@tanstack/react-query"
import branchApi from "../services/branchApi"

const useBranch = () => {
  return useQuery({
    queryKey: ['branch'],
    queryFn: () => branchApi.getAll(),  
    staleTime: 1000 * 60, 
  });
};

export { useBranch };

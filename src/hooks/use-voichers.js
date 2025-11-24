import { useQuery } from "@tanstack/react-query";
import VoichersApi from "../services/VoichersApi";


export const useVoicher = () => {
  return useQuery({
    queryKey: ["voicher"],
    queryFn: () => VoichersApi.getAll(),
    staleTime: 60 * 1000,
  });
};
import { useQuery } from "@tanstack/react-query"
import categorApi from "../services/categoryApi";
const useCategory = ()=>{
    return useQuery({
        queryKey:["category"],
        queryFn: () => categorApi.getAll(),
        staleTime: 60*1000
    })
}

export { useCategory }
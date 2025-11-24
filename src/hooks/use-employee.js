import { useQuery } from "@tanstack/react-query"
import loginApi from "../services/loginApi";
const useEmployee = ()=>{
    return useQuery({
        queryKey:["employees"],
        queryFn: () => loginApi.getAll(),
        staleTime: 60*1000,
        refetchOnWindowFocus: false
    })
}

export { useEmployee }
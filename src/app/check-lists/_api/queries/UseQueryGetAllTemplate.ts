import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useQueryGetAllTemplate = () => {
    return useQuery({
        queryKey: ["get-all-template"],
        queryFn: async () => {
            const response = await api.get("/checklist-templates");
            return response.data;
        },
    });
};

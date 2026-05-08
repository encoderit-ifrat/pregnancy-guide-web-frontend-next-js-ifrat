import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useQueryGetAllTemplate = (limit: number = 10) => {
    return useQuery({
        queryKey: ["get-all-template", limit],
        queryFn: async () => {
            const response = await api.get(
                `/checklist-templates?limit=${limit}`
            );
            return response.data;
        },
        placeholderData: keepPreviousData,
    });
};

import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";


export const useMutationCreateTemplate = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post("/checklists/clone-from-templates", data);
            return response.data;
        },
    });
};
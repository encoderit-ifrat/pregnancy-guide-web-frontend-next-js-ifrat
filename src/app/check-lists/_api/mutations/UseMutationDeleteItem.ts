import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

export const useMutationDeleteItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["delete-item"],
        mutationFn: (id: string) => api.delete(`/checklist-items/${id}`),
        onSuccess: () => {
            toast.success("Item deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["get-all-my-checklists"] });
        },
        onError: (error) => {
            toast.error("Failed to delete item");
        },
    });
};
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { TaskFormValues } from "../../_component/TaskForm";
import { format } from "date-fns";
import { toast } from "sonner";

export const useMutationUpdateItem = () => {
    return useMutation({
        mutationKey: ["update-item"],
        mutationFn: ({ id, data }: { id: string; data: TaskFormValues }) => {
            const { checklist_id, ...updateData } = data;
            return api.patch(`/checklist-items/${id}`, omitEmpty({ ...updateData, due_date: format(data.due_date, "yyyy-MM-dd") }));
        },
        onSuccess: () => {
            toast.success("Item updated successfully");
        },
        onError: (error) => {
            toast.error("Failed to update item");
        },
    });
};
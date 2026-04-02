import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { TaskFormValues } from "../../_component/TaskForm";
import { format } from "date-fns";


export const useMutationCreateItem = () => {
    return useMutation({
        mutationKey: ["create-item"],
        mutationFn: (body: TaskFormValues) =>
            api.post("/checklist-items", omitEmpty({ ...body, due_date: format(body.due_date, "yyyy-MM-dd") })),
    });
};
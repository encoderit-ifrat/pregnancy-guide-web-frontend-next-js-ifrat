import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type TProps = {
    id: string | number;
};
export const useQuestionDislike = () =>
    useMutation({
        mutationKey: ["useQuestionDislike"],
        mutationFn: async ({ id }: TProps) => {
            return await api.post(`questions/answers/${id}/dislike`);
        },
    });
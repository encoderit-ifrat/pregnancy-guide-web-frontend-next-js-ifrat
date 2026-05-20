import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type TProps = {
    id: string | number;
};
export const useQuestionLike = () =>
    useMutation({
        mutationKey: ["useQuestionLike"],
        mutationFn: async ({ id }: TProps) => {
            return await api.post(`questions/answers/${id}/like`);
        },
    });
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMutationSwipeTinderName } from "../../for-name-tinder/_api/mutations/useMutationSwipeTinderName";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

export const useMutationDeleteMatchingName = () => {
  const queryClient = useQueryClient();
  const { mutate: swipe } = useMutationSwipeTinderName();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: string) => {
      return new Promise((resolve, reject) => {
        swipe(
          { id, action: "dislike" },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        );
      });
    },
    onSuccess: () => {
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["tinder-names-matching"] });
      toast.success(t("profile.deleteSuccess") || "Name removed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove name"
      );
    },
  });
};

import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { omitEmpty } from "@/lib/utils";
import {
  PublicWishlist,
  PublicWishlistItem,
  WishlistFormValues,
  WishlistItemFormValues,
} from "../../_types/wishlist_types";
import { wishlistKeys } from "../queries/useQueryWishlists";

export const useCreateWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["wishlists", "create"],
    mutationFn: (body: WishlistFormValues) => {
      if (body.cover_image instanceof File) {
        const formData = new FormData();
        formData.append("title", body.title);
        if (body.description) formData.append("description", body.description);
        if (body.reply_by) formData.append("reply_by", body.reply_by);
        formData.append("cover_image", body.cover_image);
        return api.post("/wishlists", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      return api.post("/wishlists", omitEmpty(body));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlists", "list"] }),
  });
};

export const useUpdateWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["wishlists", "update"],
    mutationFn: ({ id, body }: { id: string; body: Partial<WishlistFormValues> }) =>
      api.patch(`/wishlists/${id}`, omitEmpty(body)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlists"] }),
  });
};

export const useDeleteWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["wishlists", "delete"],
    mutationFn: (id: string) => api.delete(`/wishlists/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlists", "list"] }),
  });
};

export const useAddWishlistItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["wishlists", "add-item"],
    mutationFn: ({ id, body }: { id: string; body: WishlistItemFormValues }) =>
      api.post(`/wishlists/${id}/items`, omitEmpty(body)),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["wishlists", "detail", v.id] }),
  });
};

export const useUpdateWishlistItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["wishlists", "update-item"],
    mutationFn: ({
      id,
      itemId,
      body,
    }: {
      id: string;
      itemId: string;
      body: Partial<WishlistItemFormValues>;
    }) => api.patch(`/wishlists/${id}/items/${itemId}`, omitEmpty(body)),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["wishlists", "detail", v.id] }),
  });
};

export const useDeleteWishlistItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["wishlists", "delete-item"],
    mutationFn: ({ id, itemId }: { id: string; itemId: string }) =>
      api.delete(`/wishlists/${id}/items/${itemId}`),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["wishlists", "detail", v.id] }),
  });
};

export const useClaimWishlistItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["wishlists", "claim"],
    mutationFn: ({
      token,
      itemId,
      body,
    }: {
      token: string;
      itemId: string;
      body: {
        claimer_name: string;
        claimer_email: string;
        message?: string;
      };
    }) =>
      api.post(
        `/public/wishlists/${token}/items/${itemId}/claim`,
        omitEmpty(body)
      ),
    onSuccess: (res, v) => {
      // Update the cache directly from the claim response so the list reflects
      // the reservation immediately, instead of depending on refetch timing.
      const claimStatus = res?.data?.data?.claim_status as
        | PublicWishlistItem["claim_status"]
        | undefined;
      if (claimStatus) {
        qc.setQueryData<PublicWishlist>(
          wishlistKeys.public(v.token),
          (old) =>
            old
              ? {
                  ...old,
                  items: old.items.map((it) =>
                    it._id === v.itemId
                      ? { ...it, claim_status: claimStatus }
                      : it
                  ),
                }
              : old
        );
      }
      qc.invalidateQueries({ queryKey: wishlistKeys.public(v.token) });
    },
  });
};

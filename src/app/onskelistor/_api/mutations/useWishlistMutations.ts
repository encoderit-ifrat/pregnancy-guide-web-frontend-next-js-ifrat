import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { omitEmpty } from "@/lib/utils";
import {
  WishlistFormValues,
  WishlistItemFormValues,
} from "../../_types/wishlist_types";

export const useCreateWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["wishlists", "create"],
    mutationFn: (body: WishlistFormValues) =>
      api.post("/wishlists", omitEmpty(body)),
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
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["wishlists", "public", v.token] }),
  });
};

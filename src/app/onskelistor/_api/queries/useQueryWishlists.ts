import api from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  MemberWishlist,
  PublicWishlist,
  WishlistDetail,
  WishlistListItem,
} from "../../_types/wishlist_types";
import { Paginated } from "@/types/pagination";

export const wishlistKeys = {
  list: (page?: number) => ["wishlists", "list", page] as const,
  detail: (id: string, page?: number, search?: string) =>
    ["wishlists", "detail", id, page, search] as const,
  public: (token: string) => ["wishlists", "public", token] as const,
  invitation: (token: string) => ["wishlists", "invitation", token] as const,
};

export const useQueryWishlists = (page = 1, limit = 8) =>
  useQuery({
    queryKey: wishlistKeys.list(page),
    queryFn: async () => {
      const res = await api.get("/wishlists", { params: { page, limit } });
      return res.data.data as Paginated<WishlistListItem>;
    },
  });

export const useQueryWishlistDetail = (
  id: string,
  page = 1,
  limit = 10,
  search?: string
) =>
  useQuery({
    queryKey: wishlistKeys.detail(id, page, search),
    enabled: !!id,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.get(`/wishlists/${id}`, {
        params: { page, limit, search },
      });
      return res.data.data as WishlistDetail;
    },
  });

export const useQueryPublicWishlist = (token: string) =>
  useQuery({
    queryKey: wishlistKeys.public(token),
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get(`/public/wishlists/${token}`, {
        params: {
          _cb: Date.now(),
        },
      });
      return res.data.data as PublicWishlist;
    },
  });

// Member view resolved through an event-invitation token. Includes reserver
// name and message on reserved items (the anonymous public list does not).
export const useQueryInvitationWishlist = (token: string) =>
  useQuery({
    queryKey: wishlistKeys.invitation(token),
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get(`/public/event-invitations/${token}/wishlist`);
      return res.data.data as MemberWishlist;
    },
  });

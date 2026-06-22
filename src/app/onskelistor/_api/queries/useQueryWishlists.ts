import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  PublicWishlist,
  WishlistDetail,
  WishlistListItem,
} from "../../_types/wishlist_types";
import { Paginated } from "@/types/pagination";

export const wishlistKeys = {
  list: (page?: number) => ["wishlists", "list", page] as const,
  detail: (id: string) => ["wishlists", "detail", id] as const,
  public: (token: string) => ["wishlists", "public", token] as const,
};

export const useQueryWishlists = (page = 1, limit = 12) =>
  useQuery({
    queryKey: wishlistKeys.list(page),
    queryFn: async () => {
      const res = await api.get("/wishlists", { params: { page, limit } });
      return res.data.data as Paginated<WishlistListItem>;
    },
  });

export const useQueryWishlistDetail = (id: string) =>
  useQuery({
    queryKey: wishlistKeys.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/wishlists/${id}`);
      return res.data.data as WishlistDetail;
    },
  });

export const useQueryPublicWishlist = (token: string) =>
  useQuery({
    queryKey: wishlistKeys.public(token),
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get(`/public/wishlists/${token}`);
      return res.data.data as PublicWishlist;
    },
  });
